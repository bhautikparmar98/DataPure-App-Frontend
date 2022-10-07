import Konva from 'konva';
import _ from 'lodash';
import { useEffect, useCallback, useState, RefObject } from 'react';
import { Class } from 'src/constants';

interface Props {
  stageRef: RefObject<Konva.Stage>;
  zooming: boolean;
  stageDragging: boolean;
  classes: Class[];
}

const useShapesCache = ({
  stageRef,
  zooming,
  stageDragging,
  classes,
}: Props) => {
  const shapes = stageRef.current?.find(
    '#shapes_group'
  )[0] as Konva.Group | null;
  const bgLayer = stageRef.current?.find(
    '#background_layer'
  )[0] as Konva.Layer | null;

  const [cachedShapes, setCachedShapes] = useState<Konva.Group | null>(null);
  const [shouldCache, setShouldCache] = useState(true);
  const [cachedVisible, setCachedVisible] = useState(false);

  // console.log('call');
  const handleShapesCaching = () => {
    if (!cachedShapes) return;

    if (shouldCache) {
      bgLayer?.findOne('#shapes_clone')?.show();
      setCachedVisible(true);
      // console.log(bgLayer);
    } else {
      bgLayer?.findOne('#shapes_clone')?.hide();
      // console.log(bgLayer);
      setCachedVisible(false);
    }
  };

  const setNewCache = useCallback(
    _.debounce(() => {
      if (stageDragging || zooming) return;
      if (shapes && shapes.children && shapes.children.length > 0) {
        if (cachedShapes) {
          bgLayer?.findOne('#shapes_clone')?.destroy();
        }
        //create new cache
        const newCache = shapes?.clone();
        if (newCache) {
          newCache.cache();
          newCache.hide();
          newCache.attrs.id = 'shapes_clone';
          bgLayer?.add(newCache);
          setCachedShapes(newCache);
        }
      }
    }, 3000),
    [shapes, zooming, stageDragging]
  );

  //update cache when classes change
  useEffect(() => {
    console.log('new cache');
    setNewCache();
  }, [shapes]);

  //show cache while zooming/stageDragging
  useEffect(() => {
    handleShapesCaching();
  }, [shouldCache]);

  useEffect(() => {
    stageDragging || zooming ? setShouldCache(true) : setShouldCache(false);
  }, [stageDragging, zooming]);

  // console.log(cachedVisible);

  return {
    cachedVisible,
  };
};

export default useShapesCache;
