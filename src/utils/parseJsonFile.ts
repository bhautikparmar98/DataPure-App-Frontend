export const parseJsonFile = (blob: Blob): Promise<any> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.onload = (event) => {
      if (event.target?.result && typeof event.target.result === 'string')
        resolve(JSON.parse(event.target.result));

      resolve(event.target?.result);
    };
    fileReader.onerror = (error) => reject(error);

    // fire the event;
    fileReader.readAsText(blob);
  });
};
