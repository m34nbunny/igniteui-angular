import { FilteringExpressionsTree } from '../../../data-operations/filtering-expressions-tree';
/**
 * @hidden @internal
 */
export class FilterListItem {
    constructor() {
        this.isSpecial = false;
        this.isBlanks = false;
    }
}
/**
 * @hidden
 */
export class ExpressionUI {
    constructor() {
        this.isSelected = false;
        this.isVisible = true;
    }
}
export function generateExpressionsList(expressions, operator, expressionsUIs) {
    generateExpressionsListRecursive(expressions, operator, expressionsUIs);
    // The beforeOperator of the first expression and the afterOperator of the last expression should be null
    if (expressionsUIs.length) {
        expressionsUIs[expressionsUIs.length - 1].afterOperator = null;
    }
}
function generateExpressionsListRecursive(expressions, operator, expressionsUIs) {
    if (!expressions) {
        return;
    }
    if (expressions instanceof FilteringExpressionsTree) {
        const expressionsTree = expressions;
        for (const operand of expressionsTree.filteringOperands) {
            generateExpressionsListRecursive(operand, expressionsTree.operator, expressionsUIs);
        }
        if (expressionsUIs.length) {
            expressionsUIs[expressionsUIs.length - 1].afterOperator = operator;
        }
    }
    else {
        const exprUI = new ExpressionUI();
        exprUI.expression = expressions;
        exprUI.afterOperator = operator;
        const prevExprUI = expressionsUIs[expressionsUIs.length - 1];
        if (prevExprUI) {
            exprUI.beforeOperator = prevExprUI.afterOperator;
        }
        expressionsUIs.push(exprUI);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvaWduaXRldWktYW5ndWxhci9zcmMvbGliL2dyaWRzL2ZpbHRlcmluZy9leGNlbC1zdHlsZS9jb21tb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLHdCQUF3QixFQUE2QixNQUFNLHFEQUFxRCxDQUFDO0FBRTFIOztHQUVHO0FBQ0gsTUFBTSxPQUFPLGNBQWM7SUFBM0I7UUFNVyxjQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ2xCLGFBQVEsR0FBRyxLQUFLLENBQUM7SUFHNUIsQ0FBQztDQUFBO0FBRUQ7O0dBRUc7QUFDSCxNQUFNLE9BQU8sWUFBWTtJQUF6QjtRQUlXLGVBQVUsR0FBRyxLQUFLLENBQUM7UUFDbkIsY0FBUyxHQUFHLElBQUksQ0FBQztJQUM1QixDQUFDO0NBQUE7QUFFRCxNQUFNLFVBQVUsdUJBQXVCLENBQUMsV0FBNkQsRUFDakcsUUFBd0IsRUFDeEIsY0FBOEI7SUFDOUIsZ0NBQWdDLENBQUMsV0FBVyxFQUFFLFFBQVEsRUFBRSxjQUFjLENBQUMsQ0FBQztJQUV4RSx5R0FBeUc7SUFDekcsSUFBSSxjQUFjLENBQUMsTUFBTSxFQUFFO1FBQ3ZCLGNBQWMsQ0FBQyxjQUFjLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7S0FDbEU7QUFDTCxDQUFDO0FBR0QsU0FBUyxnQ0FBZ0MsQ0FBQyxXQUE2RCxFQUNuRyxRQUF3QixFQUN4QixjQUE4QjtJQUM5QixJQUFJLENBQUMsV0FBVyxFQUFFO1FBQ2QsT0FBTztLQUNWO0lBRUQsSUFBSSxXQUFXLFlBQVksd0JBQXdCLEVBQUU7UUFDakQsTUFBTSxlQUFlLEdBQUcsV0FBdUMsQ0FBQztRQUNoRSxLQUFLLE1BQU0sT0FBTyxJQUFJLGVBQWUsQ0FBQyxpQkFBaUIsRUFBRTtZQUNyRCxnQ0FBZ0MsQ0FBQyxPQUFPLEVBQUUsZUFBZSxDQUFDLFFBQVEsRUFBRSxjQUFjLENBQUMsQ0FBQztTQUN2RjtRQUNELElBQUksY0FBYyxDQUFDLE1BQU0sRUFBRTtZQUN2QixjQUFjLENBQUMsY0FBYyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxhQUFhLEdBQUcsUUFBUSxDQUFDO1NBQ3RFO0tBQ0o7U0FBTTtRQUNILE1BQU0sTUFBTSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDbEMsTUFBTSxDQUFDLFVBQVUsR0FBRyxXQUFtQyxDQUFDO1FBQ3hELE1BQU0sQ0FBQyxhQUFhLEdBQUcsUUFBUSxDQUFDO1FBRWhDLE1BQU0sVUFBVSxHQUFHLGNBQWMsQ0FBQyxjQUFjLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzdELElBQUksVUFBVSxFQUFFO1lBQ1osTUFBTSxDQUFDLGNBQWMsR0FBRyxVQUFVLENBQUMsYUFBYSxDQUFDO1NBQ3BEO1FBRUQsY0FBYyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUMvQjtBQUNMLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBGaWx0ZXJpbmdMb2dpYywgSUZpbHRlcmluZ0V4cHJlc3Npb24gfSBmcm9tICcuLi8uLi8uLi9kYXRhLW9wZXJhdGlvbnMvZmlsdGVyaW5nLWV4cHJlc3Npb24uaW50ZXJmYWNlJztcbmltcG9ydCB7IEZpbHRlcmluZ0V4cHJlc3Npb25zVHJlZSwgSUZpbHRlcmluZ0V4cHJlc3Npb25zVHJlZSB9IGZyb20gJy4uLy4uLy4uL2RhdGEtb3BlcmF0aW9ucy9maWx0ZXJpbmctZXhwcmVzc2lvbnMtdHJlZSc7XG5cbi8qKlxuICogQGhpZGRlbiBAaW50ZXJuYWxcbiAqL1xuZXhwb3J0IGNsYXNzIEZpbHRlckxpc3RJdGVtIHtcbiAgICBwdWJsaWMgdmFsdWU6IGFueTtcbiAgICBwdWJsaWMgbGFiZWw6IGFueTtcbiAgICBwdWJsaWMgaXNTZWxlY3RlZDogYm9vbGVhbjtcbiAgICBwdWJsaWMgaW5kZXRlcm1pbmF0ZTogYm9vbGVhbjtcbiAgICBwdWJsaWMgaXNGaWx0ZXJlZDogYm9vbGVhbjtcbiAgICBwdWJsaWMgaXNTcGVjaWFsID0gZmFsc2U7XG4gICAgcHVibGljIGlzQmxhbmtzID0gZmFsc2U7XG4gICAgcHVibGljIGNoaWxkcmVuPzogQXJyYXk8RmlsdGVyTGlzdEl0ZW0+O1xuICAgIHB1YmxpYyBwYXJlbnQ/OiBGaWx0ZXJMaXN0SXRlbTtcbn1cblxuLyoqXG4gKiBAaGlkZGVuXG4gKi9cbmV4cG9ydCBjbGFzcyBFeHByZXNzaW9uVUkge1xuICAgIHB1YmxpYyBleHByZXNzaW9uOiBJRmlsdGVyaW5nRXhwcmVzc2lvbjtcbiAgICBwdWJsaWMgYmVmb3JlT3BlcmF0b3I6IEZpbHRlcmluZ0xvZ2ljO1xuICAgIHB1YmxpYyBhZnRlck9wZXJhdG9yOiBGaWx0ZXJpbmdMb2dpYztcbiAgICBwdWJsaWMgaXNTZWxlY3RlZCA9IGZhbHNlO1xuICAgIHB1YmxpYyBpc1Zpc2libGUgPSB0cnVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGVFeHByZXNzaW9uc0xpc3QoZXhwcmVzc2lvbnM6IElGaWx0ZXJpbmdFeHByZXNzaW9uc1RyZWUgfCBJRmlsdGVyaW5nRXhwcmVzc2lvbixcbiAgICBvcGVyYXRvcjogRmlsdGVyaW5nTG9naWMsXG4gICAgZXhwcmVzc2lvbnNVSXM6IEV4cHJlc3Npb25VSVtdKTogdm9pZCB7XG4gICAgZ2VuZXJhdGVFeHByZXNzaW9uc0xpc3RSZWN1cnNpdmUoZXhwcmVzc2lvbnMsIG9wZXJhdG9yLCBleHByZXNzaW9uc1VJcyk7XG5cbiAgICAvLyBUaGUgYmVmb3JlT3BlcmF0b3Igb2YgdGhlIGZpcnN0IGV4cHJlc3Npb24gYW5kIHRoZSBhZnRlck9wZXJhdG9yIG9mIHRoZSBsYXN0IGV4cHJlc3Npb24gc2hvdWxkIGJlIG51bGxcbiAgICBpZiAoZXhwcmVzc2lvbnNVSXMubGVuZ3RoKSB7XG4gICAgICAgIGV4cHJlc3Npb25zVUlzW2V4cHJlc3Npb25zVUlzLmxlbmd0aCAtIDFdLmFmdGVyT3BlcmF0b3IgPSBudWxsO1xuICAgIH1cbn1cblxuXG5mdW5jdGlvbiBnZW5lcmF0ZUV4cHJlc3Npb25zTGlzdFJlY3Vyc2l2ZShleHByZXNzaW9uczogSUZpbHRlcmluZ0V4cHJlc3Npb25zVHJlZSB8IElGaWx0ZXJpbmdFeHByZXNzaW9uLFxuICAgIG9wZXJhdG9yOiBGaWx0ZXJpbmdMb2dpYyxcbiAgICBleHByZXNzaW9uc1VJczogRXhwcmVzc2lvblVJW10pOiB2b2lkIHtcbiAgICBpZiAoIWV4cHJlc3Npb25zKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoZXhwcmVzc2lvbnMgaW5zdGFuY2VvZiBGaWx0ZXJpbmdFeHByZXNzaW9uc1RyZWUpIHtcbiAgICAgICAgY29uc3QgZXhwcmVzc2lvbnNUcmVlID0gZXhwcmVzc2lvbnMgYXMgRmlsdGVyaW5nRXhwcmVzc2lvbnNUcmVlO1xuICAgICAgICBmb3IgKGNvbnN0IG9wZXJhbmQgb2YgZXhwcmVzc2lvbnNUcmVlLmZpbHRlcmluZ09wZXJhbmRzKSB7XG4gICAgICAgICAgICBnZW5lcmF0ZUV4cHJlc3Npb25zTGlzdFJlY3Vyc2l2ZShvcGVyYW5kLCBleHByZXNzaW9uc1RyZWUub3BlcmF0b3IsIGV4cHJlc3Npb25zVUlzKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXhwcmVzc2lvbnNVSXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBleHByZXNzaW9uc1VJc1tleHByZXNzaW9uc1VJcy5sZW5ndGggLSAxXS5hZnRlck9wZXJhdG9yID0gb3BlcmF0b3I7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBleHByVUkgPSBuZXcgRXhwcmVzc2lvblVJKCk7XG4gICAgICAgIGV4cHJVSS5leHByZXNzaW9uID0gZXhwcmVzc2lvbnMgYXMgSUZpbHRlcmluZ0V4cHJlc3Npb247XG4gICAgICAgIGV4cHJVSS5hZnRlck9wZXJhdG9yID0gb3BlcmF0b3I7XG5cbiAgICAgICAgY29uc3QgcHJldkV4cHJVSSA9IGV4cHJlc3Npb25zVUlzW2V4cHJlc3Npb25zVUlzLmxlbmd0aCAtIDFdO1xuICAgICAgICBpZiAocHJldkV4cHJVSSkge1xuICAgICAgICAgICAgZXhwclVJLmJlZm9yZU9wZXJhdG9yID0gcHJldkV4cHJVSS5hZnRlck9wZXJhdG9yO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwcmVzc2lvbnNVSXMucHVzaChleHByVUkpO1xuICAgIH1cbn1cbiJdfQ==