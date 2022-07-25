import type { NextPage } from 'next';
import Router from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import React, { useRef, useState } from 'react';
import styles from '../styles/Home.module.css';
import Ocr from './ocr';

const Home: NextPage = () => {
  const [imgSrc, setImgSrc] = useState('');
  const [showOcr, setShowOCr] = useState(false);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    console.log(imgSrc);
    if (imgSrc.length > 0) {
      setShowOCr(true);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length !== 1) {
      return;
    }

    let image = e.target.files[0];
    // setImgSrc(image);
    console.log(image);
    setImgSrc(URL.createObjectURL(image));
  };

  return showOcr ? (
    <Ocr imgSrc={imgSrc} />
  ) : (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h3 className={styles.title}>Image Annotation App</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="file"
            id="anno-img-upload"
            name="Image"
            onChange={handleImageChange}
            accept="image/png, image/jpeg"
          />
          <input type="submit" value="Start Annotating" />
        </form>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
};

export default Home;
