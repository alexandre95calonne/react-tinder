import React, { useState, useEffect, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimation,
} from "framer-motion";
import IconButton from "../icons/Icon";

const Card = ({
  item,
  index,
  swipe,
  currentImageIndex,
  nextImage,
  goToImage,
  showInfo,
  toggleInfo,
  isCurrent,
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const controls = useAnimation();

  const autoSwipe = useCallback(
    async (direction) => {
      const xMove = direction === "right" ? 700 : -700;
      const yMove = direction === "up" ? -600 : -100;
      await controls.start({
        x: xMove,
        y: yMove,
        rotate: direction === "right" ? 30 : -30,
        transition: { duration: 0.4 },
      });
      swipe(direction, item.id);
      if (direction === "up" && item.link) {
        setTimeout(() => {
          window.open(item.link, "_blank");
        }, 1000);
      }
    },
    [controls, swipe, item.id, item.link]
  );

  useEffect(() => {
    if (isCurrent) {
      const handleKeyDown = (event) => {
        if (event.key === "ArrowRight") {
          autoSwipe("right");
        } else if (event.key === "ArrowLeft") {
          autoSwipe("left");
        } else if (event.key === "ArrowUp") {
          autoSwipe("up");
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isCurrent, autoSwipe]);

  return (
    <motion.div
      drag
      dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
      dragElastic={0.5}
      style={{
        x,
        y,
        rotate,
        height: "70vh",
        width: "500px",
        zIndex: 1000 + index,
      }}
      onDragEnd={(event, info) => {
        const offsetX = info.offset.x;
        const offsetY = info.offset.y;
        if (offsetX < -200) {
          swipe("left", item.id);
        } else if (offsetX > 200) {
          swipe("right", item.id);
        } else if (offsetY < -150) {
          window.open(item.link, "_blank");
          swipe("up", item.id);
        }
      }}
      className="absolute cursor-pointer rounded-lg shadow-lg overflow-hidden"
      initial={{ x: 0, y: 0, scale: 1 }}
      animate={controls}
      transition={{ type: "spring", stiffness: 120 }}
    >
      <div className="relative h-full w-full">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${item.images[currentImageIndex[index]]})`,
          }}
          onClick={() => (showInfo ? toggleInfo() : nextImage(index))}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70">
          <div className="absolute left-1/2 top-2 flex -translate-x-1/2 transform space-x-2">
            {item.images.map((_, imgIndex) => (
              <div
                key={imgIndex}
                className={`h-2 w-9 rounded-full ${
                  imgIndex === currentImageIndex[index]
                    ? "bg-white"
                    : "bg-gray-500"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  goToImage(index, imgIndex);
                }}
              ></div>
            ))}
          </div>
          {!showInfo ? (
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <h3 className="text-xl font-bold">{item.name}</h3>
              <p className="text-lg">{item.age} years old</p>
              <p className="text-base">{item.bio}</p>
            </div>
          ) : (
            <div
              className="absolute bottom-0 left-0 right-0 overflow-scroll rounded-t-lg bg-white/90 p-4 pb-11 text-black shadow-lg"
              style={{ height: "80%" }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold">{item.name}</h3>
              <p className="text-lg">{item.age} years old</p>
              <p className="text-base">{item.bio}</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Card;
