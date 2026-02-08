import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

import Modal from "../components/Modal";
import cloudinary from "../utils/cloudinary";
import getBase64ImageUrl from "../utils/generateBlurPlaceholder";
import type { ImageProps } from "../utils/types";
import { useLastViewedPhoto } from "../utils/useLastViewedPhoto";
import SimpleImageModal from "../components/SimpleImageModal";

const ServiceCard = ({
  title,
  link,
  index,
}: {
  title: string;
  link: string;
  index: number;
}) => (
  <a
    href={link}
    className="service-card group relative rounded-2xl border border-black/10 bg-white p-8 transition hover:-translate-y-1 hover:shadow-lg"
  >
    <span className="service-index block text-sm text-gray-400">
      {String(index + 1).padStart(2, "0")}
    </span>

    <h3 className="text-lg font-medium text-gray-900 group-hover:text-black">
      {title}
    </h3>
  </a>
);


const PhoneIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.86 19.86 0 0 1 3 5.18 2 2 0 0 1 5 3h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L9 10a16 16 0 0 0 5 5l.36-.36a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M20.52 3.48A11.86 11.86 0 0 0 12 .14 11.86 11.86 0 0 0 1.14 17.71L0 24l6.48-1.66A11.86 11.86 0 0 0 12 24h.01a11.86 11.86 0 0 0 8.51-20.52zM12 21.85a9.83 9.83 0 0 1-5.02-1.39l-.36-.21-3.85.99 1.03-3.75-.24-.38a9.82 9.82 0 1 1 8.44 4.74zm5.44-7.35c-.3-.15-1.77-.87-2.05-.97s-.48-.15-.68.15-.78.97-.96 1.17-.35.22-.65.07a8 8 0 0 1-2.35-1.45 8.67 8.67 0 0 1-1.6-1.99c-.17-.3 0-.46.13-.61.14-.14.3-.35.45-.52s.2-.3.3-.5a.55.55 0 0 0 0-.52c-.07-.15-.68-1.64-.94-2.25s-.5-.5-.68-.51h-.58a1.11 1.11 0 0 0-.8.37 3.36 3.36 0 0 0-1.05 2.5 5.85 5.85 0 0 0 1.23 3.12 13.33 13.33 0 0 0 5.12 4.48c.64.28 1.13.45 1.52.58a3.65 3.65 0 0 0 1.68.11 2.76 2.76 0 0 0 1.82-1.28 2.22 2.22 0 0 0 .15-1.28c-.06-.1-.26-.16-.56-.31z" />
  </svg>
);

const HERO_IMAGES = [
  "/hero.jpg",
  "/hero2.jpg",
  "/hero3.jpeg",
  "/hero4.jpg",
  "/hero5.jpeg",
  "/hero6.jpg",
];


const Home: NextPage = ({
  imagesByService,
}: {
  imagesByService: Record<string, ImageProps[]>;
}) => {
  const router = useRouter();
  const { photoId } = router.query;
  const [lastViewedPhoto, setLastViewedPhoto] = useLastViewedPhoto();
  const [imageLoading, setImageLoading] = useState(true);
  const lastViewedPhotoRef = useRef<HTMLAnchorElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const [activeService, setActiveService] = useState<keyof typeof serviceTitles>(
    "aluminium"
  );
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setImageLoading(true);
  }, [activeService]);

  useEffect(() => {
    if (lastViewedPhoto && !photoId) {
      lastViewedPhotoRef.current?.scrollIntoView({ block: "center" });
      setLastViewedPhoto(null);
    }
  }, [photoId, lastViewedPhoto, setLastViewedPhoto]);

  const serviceTitles: Record<string, string> = {
    aluminium: "Aluminium Works",
    tuffanpartition: "Tuffan Partition",
    furnituresofaset: "Furniture & Sofa Set",
    ledmirror: "LED Mirror",
    ralingkathera: "Railing & Kathera",
    profileshutter: "Profile Shutter",
  };
  const services: Record<string, string> = {
    designwork: "Design Work",
    aluminium: "Aluminium Section",
    tuffanpartition: "Tuffan door & Partition",
    furnituresofaset: "Furniture & Sofa Set",
    ledmirror: "LED Mirror",
    ralingkathera: "Railing & Kathera",
    profileshutter: "Profile Shutter",
    modular: "Modular Kitchen",

  };

  return (
    <>
      <Head>
        <title>Premium Aluminium & Interior Works</title>
        <meta
          name="description"
          content="Aluminium works, glass partitions, LED mirrors, railings, furniture and profile shutters."
        />
      </Head>

      <header
        className={`sticky top-0 z-50 transition-all duration-300
    ${isScrolled
            ? "bg-white/80 backdrop-blur border-b border-black/10 shadow-sm"
            : "bg-[#f3ebe2] border-b border-[#2d3c6750]"
          }`}
      >
        <div className="mx-auto flex w-full max-w-screen-2xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Image
            src="/main-logo.png"
            alt="Super Glass Aluminium & PVC Furniture"
            width={160}
            height={48}
            className="h-14 w-auto object-contain"
            priority
          />
          <div className="flex items-center gap-6 text-gray-800">
            <a
              href="tel:+9998314246"
              className="flex items-center gap-2 text-sm transition hover:opacity-70"
            >
              <PhoneIcon />
              <span className="hidden sm:inline">Call</span>
            </a>

            <a
              href="https://wa.me/918273647861"
              className="flex items-center gap-2 rounded-full border border-black/20 px-4 py-2 text-sm transition
                   hover:bg-black hover:text-white"
            >
              <WhatsAppIcon />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          </div>
        </div>
      </header>

      <section className="bg-[#f3ebe2] hero-section">
        <div className="mx-auto flex w-full max-w-screen-2xl flex-wrap items-center justify-between gap-16 py-14 sm:px-6 lg:px-8">
          <div>
            <h1 className="font-serif text-5xl font-medium leading-tight text-gray-900 md:text-6xl">
              Super Glass Aluminium <br /> & PVC Furniture
            </h1>
            <p className="mt-6 max-w-md font-sans text-base leading-relaxed text-gray-700">
              Premium aluminium works, glass partitions, LED mirrors, railings,
              furniture, and profile shutters with professional craftsmanship.
            </p>
            <div className="contacts mt-10 flex items-center gap-6 font-sans text-sm">
              <a
                href="tel:+918273647861"
                className="border-b border-gray-900 pb-1 text-gray-900 hover:opacity-70"
              >
                Call Now
              </a>
              <a
                href="https://wa.me/919998314246"
                className="border-b border-gray-900 pb-1 text-gray-900 hover:opacity-70"
              >
                WhatsApp
              </a>
              <a
                href="https://www.instagram.com/superglass70?igsh=b2V3Z2dzbXJxYno="
                className="flex items-center gap-2 border-b border-gray-900 pb-1 text-gray-900 hover:opacity-70"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
            </div>
          </div>

          <div className="relative w-full max-w-md md:max-w-none md:w-[600px] lg:w-[650px] h-[520px] md:h-[520px] overflow-hidden rounded-3xl">
            {HERO_IMAGES.map((src, index) => (
              <Image
                key={src}
                src={src}
                alt="Aluminium and glass work"
                fill
                priority={index === 0}
                className={`object-cover transition-opacity duration-700
        ${index === currentSlide ? "opacity-100" : "opacity-0"}`}
              />
            ))}
          </div>
        </div>
      </section>


      <section
        id="services"
        className="mx-auto max-w-[1600px] px-4 py-20"
      >
        <h2 className="mb-12 text-center text-white text-3xl font-bold">
          Our Services
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
          {Object.entries(services).map(([key, title], index) => (
            <ServiceCard
              key={key}
              title={title}
              link={`#${key}`}
              index={index}
            />
          ))}
        </div>
      </section>

      {photoId && (
        <Modal
          images={Object.values(imagesByService).flat()}
          onClose={() => setLastViewedPhoto(photoId)}
        />
      )}

      <section id="gallery" className="galley-section bg-gray-50 py-24">
        <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <h2 className="gallery-title mb-10 text-center text-3xl font-semibold">
            Our Gallery
          </h2>

          <div className="sticky top-[70px] z-30 mb-10 bg-gray-50">
            <div ref={galleryRef} className="no-scrollbar flex gap-3 overflow-x-auto py-4 px-1 justify-center tabs">
              {Object.entries(serviceTitles).map(([key, title]) => {
                const count = imagesByService[key]?.length || 0;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setActiveService(key as keyof typeof serviceTitles);
                      galleryRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }}
                    className={`group flex items-center gap-3 whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium transition
        ${activeService === key
                        ? "bg-black text-white shadow"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    <span>{title}</span>

                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold transition
          ${activeService === key
                          ? "bg-white/20 text-white"
                          : "bg-gray-200 text-gray-700 group-hover:bg-gray-300"
                        }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div
            className={`grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 transition-opacity duration-300 ${imageLoading ? "opacity-0" : "opacity-100"
              }`}
          >
            {imageLoading && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 mb-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[4/3] rounded-2xl bg-gray-200"
                  />
                ))}
              </div>
            )}
            {imagesByService[activeService]?.map(
              ({ id, public_id, format, blurDataUrl }) => (
                <button
                  key={id}
                  onClick={() => setModalIndex(id)}
                  className="group block overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-lg"
                >
                  <Image
                    onLoad={() => setImageLoading(false)}
                    alt={serviceTitles[activeService]}
                    placeholder="blur"
                    blurDataURL={blurDataUrl}
                    src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,w_600,h_450/${public_id}.${format}`}
                    width={600}
                    height={450}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </button>
              )
            )}
          </div>

        </div>
      </section>

      <footer className="copyright bg-black py-8 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Super Glass Aluminium & PVC Furniture. All rights reserved.
      </footer>
      {modalIndex !== null && (
        <SimpleImageModal
          images={imagesByService[activeService]}
          index={modalIndex}
          onClose={() => setModalIndex(null)}
          onPrev={() =>
            setModalIndex((i) => (i !== null && i > 0 ? i - 1 : i))
          }
          onNext={() =>
            setModalIndex((i) =>
              i !== null && i < imagesByService[activeService].length - 1
                ? i + 1
                : i
            )
          }
        />
      )}
    </>
  );
};

export default Home;

export async function getStaticProps() {
  const folders = {
    aluminium: "services/aluminium",
    tuffanpartition: "services/tuffanpartition",
    furnituresofaset: "services/furnituresofaset",
    ledmirror: "services/ledmirror",
    ralingkathera: "services/ralingkathera",
    profileshutter: "services/profileshutter",
  };

  const imagesByService: Record<string, ImageProps[]> = {};

  for (const [key, folder] of Object.entries(folders)) {
    const results = await cloudinary.v2.search
      .expression(`folder:${folder}`)
      .sort_by("public_id", "desc")
      .max_results(400)
      .execute();

    const reducedResults: ImageProps[] = results.resources.map(
      (img: any, index: number) => ({
        id: index,
        height: img.height,
        width: img.width,
        public_id: img.public_id,
        format: img.format,
      })
    );

    const blurImages = await Promise.all(
      reducedResults.map((img) => getBase64ImageUrl(img))
    );

    reducedResults.forEach((img, i) => {
      img.blurDataUrl = blurImages[i];
    });

    imagesByService[key] = reducedResults;
  }

  return {
    props: { imagesByService },
    revalidate: 60,
  };
}
