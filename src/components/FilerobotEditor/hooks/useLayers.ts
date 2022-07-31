import { masks as defaultMasks, Mask, Layer } from '../../../constants/masks';

import { useState } from 'react';

const useLayers = () => {
  const [masks, setMasks] = useState(defaultMasks);
  const [selectedMaskId, setSelectedMaskId] = useState(0);

  const setSelectedMask = (e: any) => {
    const maskId = +e.target.value;
    setSelectedMaskId(maskId);
  };

  const deleteLayer = (maskId: number, layerId: string) => {
    const mask = masks[maskId];
    let layers = mask.layers;
    layers = layers.filter((layer) => layer.id !== layerId);
    const newMasks = [] as Mask[];
    masks.forEach((item, i) => {
      if (i === maskId) item.layers = layers;
      newMasks.push(item);
    });

    setMasks(newMasks);
  };

  const addLayer = (layer: Layer, maskId: number) => {
    setMasks((prev) => {
      return prev.map((mask, i) => {
        if (i === maskId) mask.layers.push(layer);
        return mask;
      });
    });
  };

  return {
    addLayer,
    deleteLayer,
    masks,
    setSelectedMask,
    selectedMaskId,
  };
};

export default useLayers;
