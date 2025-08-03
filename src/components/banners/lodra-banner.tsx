import React from 'react';
import Image from 'next/image';
import styles from './lodra-banner.module.scss';
import Link from 'next/link';

const LodraBanner = () => {
  return (
    <div className={styles.bannerContainer}>
      {/* Your content here */}
      <div className={styles.top_clouds}></div>
      <div className={styles.yellowSection}>
        <Image
          src="/home/ellipsisOnTopOfLego.svg"
          alt="ellipsis"
          width={982}
          height={982}
          className={styles.rounded_ellipsis}
        />
      </div>
      <div className={styles.toys_left}>
        <Image src="/home/toys.png" alt="home" width={460} height={657} />
        {/* <div className={styles.cloud_left}>
          <Image
            src="/home/cloudBlueLeft.svg"
            alt="cloud"
            width={100}
            height={100}
          />
        </div> */}
      </div>

      <div className={styles.toys_right}>
        <Image src="/home/barbie.png" alt="home" width={460} height={657} />
        {/* <div className={styles.cloud_right}>
          <Image
            src="/home/cloudBlueRight.svg"
            alt="cloud"
            width={100}
            height={100}
          />
        </div> */}
      </div>

      <div className={styles.home}>
        <Image
          src="/home/home.png"
          alt="home"
          width={582}
          height={453}
          className={styles.home_image}
        />
      </div>
      <div className={styles.ground}>
        <div className={styles.title}>
          <h3 className="font-grandstander">Mirësevini te</h3>
          <h1 className="font-grandstander">Shtëpia e Lodrave</h1>
          
          <Link href="/products" className={styles.button_link}>
            <span>Zhvillo imagjinaten me LEGO!</span>
          </Link>
        </div>
      </div>
      <div className={styles.bottomWaves}></div>
    </div>
  );
};

export default LodraBanner;