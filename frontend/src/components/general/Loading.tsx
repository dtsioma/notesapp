import React from "react";
import styles from "./Loading.module.css";

interface LoadingProps {
  transparent: boolean;
  fullScreen: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  transparent,
  fullScreen,
}) => {
  return (
    <div
      className={[
        styles.Loading,
        transparent ? styles.Transparent : null,
        fullScreen ? styles.FullScreen : null,
      ].join(" ")}
    >
      Loading...
    </div>
  );
};
