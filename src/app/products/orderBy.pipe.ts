import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'orderBy', pure: false})
export class OrderByPipe implements PipeTransform {

  static _orderByComparator(a: any, b: any): number {
    // Handle Null/Undefined first
    if (a === null || a === undefined) return 1;
    if (b === null || b === undefined) return -1;

    if ((isNaN(parseFloat(a)) || !isFinite(a)) || (isNaN(parseFloat(b)) || !isFinite(b))) {
      // Check if they are actually strings before lowercasing
      const aStr = typeof a === 'string' ? a.toLowerCase() : a;
      const bStr = typeof b === 'string' ? b.toLowerCase() : b;

      if (aStr < bStr) return -1;
      if (aStr > bStr) return 1;
    } else {
      if (parseFloat(a) < parseFloat(b)) return -1;
      if (parseFloat(a) > parseFloat(b)) return 1;
    }

    return 0;
  }

  transform<T>(values: ReadonlyArray<T>, [config = '+']): Array<T>{
    const input = values.concat();

    if(!Array.isArray(input)) return input;

    if(!Array.isArray(config) || (Array.isArray(config) && config.length == 1)){
      var propertyToCheck:string = !Array.isArray(config) ? config : config[0];
      var desc = propertyToCheck.substr(0, 1) == '-';

       //Basic array
       if(!propertyToCheck || propertyToCheck == '-' || propertyToCheck == '+'){
         return !desc ? input.sort() : input.sort().reverse();
       }
       else {
         var property:string = propertyToCheck.substr(0, 1) == '+' || propertyToCheck.substr(0, 1) == '-'
           ? propertyToCheck.substr(1)
           : propertyToCheck;

          return input.sort(function(a:any,b:any){
            return !desc ? OrderByPipe._orderByComparator(a[property], b[property])
                 : -OrderByPipe._orderByComparator(a[property], b[property]);
          });
        }
      }
      else {
        //Loop over property of the array in order and sort
        return input.sort(function(a:any,b:any){
          for(var i:number = 0; i < config.length; i++){
            var desc = config[i].substr(0, 1) == '-';
            var property = config[i].substr(0, 1) == '+' || config[i].substr(0, 1) == '-'
              ? config[i].substr(1)
              : config[i];

            var comparison = !desc ? OrderByPipe._orderByComparator(a[property], b[property])
                : -OrderByPipe._orderByComparator(a[property], b[property]);

            //Don't return 0 yet in case of needing to sort by next property
            if(comparison != 0) return comparison;
          }

        return 0; //equal each other
      });
    }
  }
}