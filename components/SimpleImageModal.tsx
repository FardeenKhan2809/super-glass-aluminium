import Image from "next/image";
import { useEffect, useState } from "react";
import Head from "next/head";

interface Props {
    images: any[];
    index: number;
    onClose: () => void;
    onPrev: () => void;
    onNext: () => void;
}

export default function SimpleImageModal({
    images,
    index,
    onClose,
    onPrev,
    onNext,
}: Props) {
    const image = images[index];
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setLoaded(false);
    }, [image.public_id]);

    // Keyboard navigation
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowLeft") onPrev();
            if (e.key === "ArrowRight") onNext();
        };

        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose, onPrev, onNext]);

    // Preload next & prev images (THIS FIXES LAG)
    useEffect(() => {
        const preload = (i: number) => {
            if (!images[i]) return;
            const img = new window.Image();
            img.src = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_fit,w_1600/${images[i].public_id}.${images[i].format}`;
        };

        preload(index + 1);
        preload(index - 1);
    }, [index, images]);

    if (!image) return null;

    <Head>
        {images[index + 1] && (
            <link
                rel="preload"
                as="image"
                href={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_60,c_fit,w_1200/${images[index + 1].public_id}.${images[index + 1].format}`}
            />
        )}
        {images[index - 1] && (
            <link
                rel="preload"
                as="image"
                href={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_60,c_fit,w_1200/${images[index - 1].public_id}.${images[index - 1].format}`}
            />
        )}
    </Head>

    return (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
            {/* BACKDROP */}
            <div
                className="absolute inset-0"
                onClick={onClose}
            />

            <div className="relative z-10 max-w-6xl w-full px-6">
                {!loaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-full max-h-[85vh] rounded-lg" />
                    </div>
                )}
                <Image
                    src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_fit,w_1600/${image.public_id}.${image.format}`}
                    alt=""
                    width={1200}
                    height={800}
                    priority
                    className="mx-auto max-h-[85vh] w-auto object-contain rounded-lg shadow-xl transition-opacity duration-200"
                />

                {/* LEFT BUTTON */}
                {index > 0 && (
                    <button
                        onClick={onPrev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 
                       h-12 w-12 rounded-full bg-black/60 
                       text-white text-3xl font-light
                       flex items-center justify-center
                       backdrop-blur-md hover:bg-black/80 transition"
                    >
                        ‹
                    </button>
                )}

                {/* RIGHT BUTTON */}
                {index < images.length - 1 && (
                    <button
                        onClick={onNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 
                       h-12 w-12 rounded-full bg-black/60 
                       text-white text-3xl font-light
                       flex items-center justify-center
                       backdrop-blur-md hover:bg-black/80 transition"
                    >
                        ›
                    </button>
                )}

                {/* CLOSE BUTTON */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 
                     h-10 w-10 rounded-full bg-black/60 
                     text-white text-xl
                     flex items-center justify-center
                     backdrop-blur-md hover:bg-black/80 transition"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}
