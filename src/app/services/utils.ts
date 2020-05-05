import { TOKENKEY } from './const';

export function GetToken(): string {
    return localStorage.getItem(TOKENKEY);
}