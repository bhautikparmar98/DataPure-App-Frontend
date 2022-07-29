import React, { useEffect, useState } from 'react';
import img from '/public/images/1.png';
import MasksPanel from './children/MasksPanel';
import FilerobotImageEditor, {
  TABS,
  TOOLS,
} from 'react-filerobot-image-editor';
import useLayers from './hooks/useLayers';

function Editor() {
  const [open, setOpen] = useState(false);
  const { masks, setSelectedMask, selectedMaskId } = useLayers();
  const [annotationsCommon, setAnnotationsCommon] = useState({
    fill: masks[selectedMaskId].color,
  });
  const [isImgEditorShown, setIsImgEditorShown] = useState(true);

  const closeImgEditor = () => {
    setIsImgEditorShown(false);
  };

  const handleModify = (currentImageDesignState: any) => {
    console.log(currentImageDesignState);
  };

  return (
    <div style={{ height: 'calc(100vh - 80px)' }}>
      <button
        onClick={(e) => setOpen((prev) => !prev)}
        style={{ display: open ? 'none' : 'inline-block' }}
      >
        Open Editor
      </button>
      {open && (
        <>
          {' '}
          <MasksPanel
            masks={masks}
            setSelectedMask={setSelectedMask}
            selectedMaskId={selectedMaskId}
          />
          <FilerobotImageEditor
            source="https://scaleflex.airstore.io/demo/stephen-walker-unsplash.jpg"
            onSave={(editedImageObject, designState) =>
              console.log('saved', editedImageObject, designState)
            }
            onClose={closeImgEditor}
            annotationsCommon={{
              fill: '#ff0000',
            }}
            Text={{ text: 'DataPure...' }}
            Crop={{
              presetsItems: [
                {
                  titleKey: 'classicTv',
                  descriptionKey: '4:3',
                  ratio: '4 / 3',
                  // icon: CropClassicTv, // optional, CropClassicTv is a React Function component. Possible (React Function component, string or HTML Element)
                },
                {
                  titleKey: 'cinemascope',
                  descriptionKey: '21:9',
                  ratio: '21 / 9',
                  // icon: CropCinemaScope, // optional, CropCinemaScope is a React Function component.  Possible (React Function component, string or HTML Element)
                },
              ],
              presetsFolders: [
                {
                  titleKey: 'socialMedia', // will be translated into Social Media as backend contains this translation key
                  // icon: Social, // optional, Social is a React Function component. Possible (React Function component, string or HTML Element)
                  groups: [
                    {
                      titleKey: 'facebook',
                      items: [
                        {
                          titleKey: 'profile',
                          width: 180,
                          height: 180,
                          descriptionKey: 'fbProfileSize',
                        },
                        {
                          titleKey: 'coverPhoto',
                          width: 820,
                          height: 312,
                          descriptionKey: 'fbCoverPhotoSize',
                        },
                      ],
                    },
                  ],
                },
              ],
            }}
            tabsIds={[TABS.ADJUST, TABS.ANNOTATE, TABS.WATERMARK]} // or {['Adjust', 'Annotate', 'Watermark']}
            defaultTabId={TABS.ANNOTATE} // or 'Annotate'
            defaultToolId={TOOLS.TEXT} // or 'Text'
          />
        </>
      )}
    </div>
  );
}

export default Editor;
