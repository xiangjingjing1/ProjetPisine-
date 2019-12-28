/**
 * Helpers functions that can be used in handlebars template.
 */

 import moment from "moment";

 /**
  * This function repeats the given block (end - start + 1) times
  * and passes the index to the block.
  * 
  * Example:
  *     {{#times 1 5}}
  *         {{this}}-
  *     {{/times}}
  * 
  * Will result in:
  *     
  *     1-2-3-4-5-
  * 
  * @param start the beginning index (included)
  * @param end the last index (included)
  * @param block the block to repeat
  */
function times(start: number, end: number, block: any) {
    var ret = '';
    for (var i = start; i <= end; i++) {
        ret += block.fn(i);
    }
    return ret;
}

/**
 * This function test if the two given parameters are equal.
 * 
 * Example:
 *  {{#eq 1 5}}     returns false
 *  {{#eq "a" "a"}} returns true
 * 
 * @param left the left hand operator assignement
 * @param right the right hand operator assignement
 */
function eq(left: any, right: any): boolean {
    return left == right;
}

/**
 * Adds two numbers and returns the result.
 * 
 * Example:
 *  {{#add 3 5}}    returns 8
 * 
 * @param i the left hand operator assignement
 * @param k the right hand operator assignement
 */
function add(i: number, k: number): number {
    return i + k;
}

/**
 * Formats the date to french date format.
 * 
 * @param date the date to format
 */
function formatDate(date: Date): string {
    return moment(date).locale("fr-FR").format("dddd DD/MM/YYYY hh:mm");
}

/**
 * Format the given date to only return day, month and year
 * 
 * @param date the date format
 */
function getDate(date: Date): string {
    return moment(date).format("YYYY-MM-DD");
}

/**
 * Format the given date to only return hours and minutes
 * 
 * @param date the date to format
 */
function getTime(date: Date): string {
    return moment(date).format("hh:mm");
}

export default {times, eq, add, formatDate, getDate, getTime};