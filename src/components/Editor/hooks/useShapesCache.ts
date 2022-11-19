import Konva from 'konva';
import _ from 'lodash';
import { useEffect, useCallback, useState, RefObject } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';

interface Props {
  stageRef: RefObject<Konva.Stage>;
  zooming: boolean;
}

/*
  Some caching scenarios have been tried for better performance:
  1- show cache `Shapes` & hide original ones
  2- keep original (visible or hidden) with listening=false and show a cached version
  3- set original listening=false, visible=true with no cached version

  It turned out that hiding the original and showing it again is an expensive process.
  And taking snapshots as cache repeatedly of the original version and show them after every drawing interaction is kinda slower than just making the original listening=false

  So the 3rd scenario mentioned above is the way to go.
*/

const useShapesCache = ({ stageRef, zooming }: Props) => {
  const stageDragging = useSelector((state: RootState) => state.editor.stageDragging);

  const [shouldCache, setShouldCache] = useState(false);
  const [cachedVisible, setCachedVisible] = useState(false);

  //show or hide cache
  const handleShapesCaching = () => {
    // if (!cachedShapes) return;
    if (shouldCache) {
      // bgLayer?.findOne("#shapes_clone")?.show();
      setCachedVisible(true);
    } else {
      // bgLayer?.findOne("#shapes_clone")?.hide();
      setCachedVisible(false);
    }
  };

  //show cache while zooming/stageDragging
  useEffect(() => {
    handleShapesCaching();
  }, [shouldCache]);

  useEffect(() => {
    stageDragging || zooming ? setShouldCache(true) : setShouldCache(false);
  }, [stageDragging, zooming]);

  return {
    cachedVisible,
  };
};

export default useShapesCache;
