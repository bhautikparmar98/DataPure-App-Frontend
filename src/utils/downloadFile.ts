import FileDownload from 'js-file-download';
import axiosInstance from './axios';

export const downloadFile = async (url: string, name: string) => {
  const now = new Date();
  const date =
    now.getFullYear() + ' ' + (now.getMonth() + 1) + ' ' + now.getDate();
  const time = now.getHours() + ' ' + now.getMinutes() + ' ' + now.getSeconds();

  const response = await axiosInstance({
    url,
    method: 'GET',
    responseType: 'blob',
  });
  FileDownload(response.data, `${name} ${date} ${time}.json`);
};
