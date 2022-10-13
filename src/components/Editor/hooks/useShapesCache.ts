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
  const stageDragging = useSelector(
    (state: RootState) => state.editor.stageDragging
  );

  // const shapes = stageRef.current?.find(
  //   "#shapes_group"
  // )[0] as Konva.Group | null;
  // const bgLayer = stageRef.current?.find(
  //   "#background_layer"
  // )[0] as Konva.Layer | null;

  const [cachedShapes, setCachedShapes] = useState<Konva.Group | null>(null);
  const [shouldCache, setShouldCache] = useState(false);
  const [cachedVisible, setCachedVisible] = useState(false);
  // const lastTimeUpdated = useSelector(
  //   (state: RootState) => state.classes.lastUpdate
  // );

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

  // const setNewCache = useCallback(
  //   _.debounce(() => {
  //     if (stageDragging || zooming) return;
  //     if (shapes && shapes.children && shapes.children.length > 0) {
  //       if (cachedShapes) {
  //         bgLayer?.findOne("#shapes_clone")?.destroy();
  //       }
  //       //create new cache
  //       const newCache = shapes?.clone();
  //       if (newCache) {
  //         newCache.cache({ drawBorder: true });
  //         newCache.hide();
  //         newCache.attrs.id = "shapes_clone";
  //         newCache.attrs.opacity = 0.6;
  //         bgLayer?.add(newCache);
  //         setCachedShapes(newCache);
  //       }
  //     }
  //   }, 400),
  //   [lastTimeUpdated]
  //   // [shapes, zooming, stageDragging, lastTimeUpdated]
  // );

  //update cache when classes change
  // useEffect(() => {
  //   setNewCache();
  // }, [shapes]);

  // useEffect(() => {
  //   lastTimeUpdated && setNewCache();
  // }, [lastTimeUpdated]);

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
