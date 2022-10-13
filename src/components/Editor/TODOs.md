**_Done_**

- [x] cache optimization
- [x] optimized useKeyboard ==> delete/backspace not working bcz of useCallback usage
- [x] optimize stage dragging
- [x] enhance tooltip position
- [x] fix cursor change when tool changes

**_TODO_**

- [ ] decrease the number of re-renders of classes panel:
  - [x] Decrease the number of annotation summary renders
  - [ ] Fix multi-select for checkbox : toggleOne is being called with old checks due to memoization of Annotation component
