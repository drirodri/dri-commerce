import { useState } from "react";
import { Gallery } from "../../type";
import "./gallery-slider.css";
import { FcNext } from "react-icons/fc";

function GallerySlider({ pictures }: Gallery) {
  const [imageIndex, setImageIndex] = useState<number>(0);

  const nextImage = () =>
    setImageIndex((prevIndex) => (prevIndex + 1) % pictures.length);

  const prevImage = () =>
    setImageIndex((prevIndex) =>
      prevIndex === 0 ? pictures.length - 1 : prevIndex - 1
    );

  return (
    <div className="gallery-slider">
      <div className="img-wrapper">
        {/* {pictures.map((image, index) => (
          <img
            key={index}
            src={image.url}
            alt={`image-${index + 1}`}
            className="slider-img"
          />
        ))} */}

        <button
          style={{ transform: "rotate(180deg" }}
          className="prev-button"
          onClick={prevImage}
        >
          <FcNext size={30} />
        </button>
        <img
          className="slider-img"
          src={pictures[imageIndex].url}
          alt={pictures[imageIndex].id}
        />
        <button className="next-button" onClick={nextImage}>
          <FcNext size={30} />
        </button>
      </div>
    </div>
  );
}

export default GallerySlider;
