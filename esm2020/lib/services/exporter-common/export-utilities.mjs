/**
 * @hidden
 */
export class ExportUtilities {
    static getKeysFromData(data) {
        const length = data.length;
        if (length === 0) {
            return [];
        }
        const dataEntry = data[0];
        const dataEntryMiddle = data[Math.floor(length / 2)];
        const dataEntryLast = data[length - 1];
        const keys1 = Object.keys(dataEntry);
        const keys2 = Object.keys(dataEntryMiddle);
        const keys3 = Object.keys(dataEntryLast);
        const keys = new Set(keys1.concat(keys2).concat(keys3));
        return !ExportUtilities.isSpecialData(dataEntry) ? Array.from(keys) : ['Column 1'];
    }
    static saveBlobToFile(blob, fileName) {
        const a = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        a.download = fileName;
        a.href = url;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }
    static stringToArrayBuffer(s) {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i !== s.length; ++i) {
            /* eslint-disable  no-bitwise */
            view[i] = s.charCodeAt(i) & 0xFF;
            /* eslint-enable  no-bitwise */
        }
        return buf;
    }
    static isSpecialData(data) {
        return (typeof data === 'string' ||
            typeof data === 'number' ||
            data instanceof Date);
    }
    static hasValue(value) {
        return value !== undefined && value !== null;
    }
    static isNullOrWhitespaces(value) {
        return value === undefined || value === null || !value.trim();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwb3J0LXV0aWxpdGllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9zZXJ2aWNlcy9leHBvcnRlci1jb21tb24vZXhwb3J0LXV0aWxpdGllcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTs7R0FFRztBQUNILE1BQU0sT0FBTyxlQUFlO0lBQ2pCLE1BQU0sQ0FBQyxlQUFlLENBQUMsSUFBVztRQUNyQyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQzNCLElBQUksTUFBTSxLQUFLLENBQUMsRUFBRTtZQUNkLE9BQU8sRUFBRSxDQUFDO1NBQ2I7UUFFRCxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUIsTUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckQsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztRQUV2QyxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3JDLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDM0MsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUV6QyxNQUFNLElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBRXhELE9BQU8sQ0FBQyxlQUFlLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3ZGLENBQUM7SUFFTSxNQUFNLENBQUMsY0FBYyxDQUFDLElBQVUsRUFBRSxRQUFRO1FBQzdDLE1BQU0sQ0FBQyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdEMsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDN0MsQ0FBQyxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFFdEIsQ0FBQyxDQUFDLElBQUksR0FBRyxHQUFHLENBQUM7UUFDYixRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3QixDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDVixRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3QixNQUFNLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBRU0sTUFBTSxDQUFDLG1CQUFtQixDQUFDLENBQVM7UUFDdkMsTUFBTSxHQUFHLEdBQUcsSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3RDLE1BQU0sSUFBSSxHQUFHLElBQUksVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2pDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFO1lBQ2pDLGdDQUFnQztZQUNoQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7WUFDakMsK0JBQStCO1NBQ2xDO1FBQ0QsT0FBTyxHQUFHLENBQUM7SUFDZixDQUFDO0lBRU0sTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFTO1FBQ2pDLE9BQU8sQ0FBQyxPQUFPLElBQUksS0FBSyxRQUFRO1lBQzVCLE9BQU8sSUFBSSxLQUFLLFFBQVE7WUFDeEIsSUFBSSxZQUFZLElBQUksQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFTSxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQVU7UUFDN0IsT0FBTyxLQUFLLEtBQUssU0FBUyxJQUFJLEtBQUssS0FBSyxJQUFJLENBQUM7SUFDakQsQ0FBQztJQUVNLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxLQUFhO1FBQzNDLE9BQU8sS0FBSyxLQUFLLFNBQVMsSUFBSSxLQUFLLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2xFLENBQUM7Q0FDSiIsInNvdXJjZXNDb250ZW50IjpbIlxuLyoqXG4gKiBAaGlkZGVuXG4gKi9cbmV4cG9ydCBjbGFzcyBFeHBvcnRVdGlsaXRpZXMge1xuICAgIHB1YmxpYyBzdGF0aWMgZ2V0S2V5c0Zyb21EYXRhKGRhdGE6IGFueVtdKSB7XG4gICAgICAgIGNvbnN0IGxlbmd0aCA9IGRhdGEubGVuZ3RoO1xuICAgICAgICBpZiAobGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBkYXRhRW50cnkgPSBkYXRhWzBdO1xuICAgICAgICBjb25zdCBkYXRhRW50cnlNaWRkbGUgPSBkYXRhW01hdGguZmxvb3IobGVuZ3RoIC8gMildO1xuICAgICAgICBjb25zdCBkYXRhRW50cnlMYXN0ID0gZGF0YVtsZW5ndGggLSAxXTtcblxuICAgICAgICBjb25zdCBrZXlzMSA9IE9iamVjdC5rZXlzKGRhdGFFbnRyeSk7XG4gICAgICAgIGNvbnN0IGtleXMyID0gT2JqZWN0LmtleXMoZGF0YUVudHJ5TWlkZGxlKTtcbiAgICAgICAgY29uc3Qga2V5czMgPSBPYmplY3Qua2V5cyhkYXRhRW50cnlMYXN0KTtcblxuICAgICAgICBjb25zdCBrZXlzID0gbmV3IFNldChrZXlzMS5jb25jYXQoa2V5czIpLmNvbmNhdChrZXlzMykpO1xuXG4gICAgICAgIHJldHVybiAhRXhwb3J0VXRpbGl0aWVzLmlzU3BlY2lhbERhdGEoZGF0YUVudHJ5KSA/IEFycmF5LmZyb20oa2V5cykgOiBbJ0NvbHVtbiAxJ107XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBzYXZlQmxvYlRvRmlsZShibG9iOiBCbG9iLCBmaWxlTmFtZSkge1xuICAgICAgICBjb25zdCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgICAgICBjb25zdCB1cmwgPSB3aW5kb3cuVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcbiAgICAgICAgYS5kb3dubG9hZCA9IGZpbGVOYW1lO1xuXG4gICAgICAgIGEuaHJlZiA9IHVybDtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChhKTtcbiAgICAgICAgYS5jbGljaygpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGEpO1xuICAgICAgICB3aW5kb3cuVVJMLnJldm9rZU9iamVjdFVSTCh1cmwpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgc3RyaW5nVG9BcnJheUJ1ZmZlcihzOiBzdHJpbmcpOiBBcnJheUJ1ZmZlciB7XG4gICAgICAgIGNvbnN0IGJ1ZiA9IG5ldyBBcnJheUJ1ZmZlcihzLmxlbmd0aCk7XG4gICAgICAgIGNvbnN0IHZpZXcgPSBuZXcgVWludDhBcnJheShidWYpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSAhPT0gcy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgLyogZXNsaW50LWRpc2FibGUgIG5vLWJpdHdpc2UgKi9cbiAgICAgICAgICAgIHZpZXdbaV0gPSBzLmNoYXJDb2RlQXQoaSkgJiAweEZGO1xuICAgICAgICAgICAgLyogZXNsaW50LWVuYWJsZSAgbm8tYml0d2lzZSAqL1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBidWY7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBpc1NwZWNpYWxEYXRhKGRhdGE6IGFueSk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gKHR5cGVvZiBkYXRhID09PSAnc3RyaW5nJyB8fFxuICAgICAgICAgICAgdHlwZW9mIGRhdGEgPT09ICdudW1iZXInIHx8XG4gICAgICAgICAgICBkYXRhIGluc3RhbmNlb2YgRGF0ZSk7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBoYXNWYWx1ZSh2YWx1ZTogYW55KTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgaXNOdWxsT3JXaGl0ZXNwYWNlcyh2YWx1ZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlID09PSBudWxsIHx8ICF2YWx1ZS50cmltKCk7XG4gICAgfVxufVxuIl19