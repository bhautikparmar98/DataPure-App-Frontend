**_Done_**

- [x] cache optimization
- [x] optimized useKeyboard ==> delete/backspace not working bcz of useCallback usage
- [x] optimize stage dragging
- [x] enhance tooltip position
- [x] fix cursor change when tool changes
- [x] decrease the number of re-renders of classes panel:

  - [x] Decrease the number of annotation summary renders
  - [x] Fix multi-select for checkbox : toggleOne is being called with old checks due to memoization of Annotation component

- Editor Status:
  - These notes were tested in the dev mode on (8 GB of ram and intel i5-8250u cpu while docker and server and local app is running in the background)
  - No performance lag noticed with instances up to 1000 instances
  - A project with 3200 instances was tested and that was noticed:
    - Stage zooming was functional, but the debounce effect was noticed (About 3 zoom levels change per second)
    - Dragging shapes speed is moderate and not smooth
    - Dragging the stage itself with such amount of shapes was bad and not advisable (useShapesCache can be used for this area of optimization)
