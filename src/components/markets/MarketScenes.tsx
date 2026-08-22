"use client";

import Image from "next/image";
import { type FC } from "react";

interface SceneProps {
  className?: string;
  accent?: string;
}

interface DioramaSceneProps extends SceneProps {
  src: string;
  alt: string;
}

const DioramaCard: FC<DioramaSceneProps> = ({ src, alt, className = "" }) => {
  return (
    <div
      className={`relative w-full max-w-[320px] sm:max-w-[360px] md:max-w-[400px] aspect-[4/3] flex items-center justify-center select-none ${className}`}
    >
      <div className="relative w-full h-full drop-shadow-[0_12px_28px_rgba(34,31,31,0.12)] transition-transform duration-500 hover:scale-[1.03]">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 280px, 400px"
          className="object-contain pointer-events-none select-none"
          priority
        />
      </div>
    </div>
  );
};

/** 1. SHARJAH */
export const SharjahScene: FC<SceneProps> = (props) => (
  <DioramaCard src="/markets/sharjah.webp" alt="Sharjah City Diorama Illustration" {...props} />
);

/** 2. AJMAN */
export const AjmanScene: FC<SceneProps> = (props) => (
  <DioramaCard src="/markets/ajman.webp" alt="Ajman City Diorama Illustration" {...props} />
);

/** 3. RAS AL KHAIMAH */
export const RakScene: FC<SceneProps> = (props) => (
  <DioramaCard src="/markets/ras-al-khaimah.webp" alt="Ras Al Khaimah City Diorama Illustration" {...props} />
);

/** 4. MASAFI */
export const MasafiScene: FC<SceneProps> = (props) => (
  <DioramaCard src="/markets/masafi.webp" alt="Masafi City Diorama Illustration" {...props} />
);

/** 5. DIBBA */
export const DibbaScene: FC<SceneProps> = (props) => (
  <DioramaCard src="/markets/dibba.webp" alt="Dibba City Diorama Illustration" {...props} />
);

/** 6. KHORFAKKAN */
export const KhorfakkanScene: FC<SceneProps> = (props) => (
  <DioramaCard src="/markets/khorfakkan.webp" alt="Khorfakkan City Diorama Illustration" {...props} />
);

/** 7. FUJAIRAH */
export const FujairahScene: FC<SceneProps> = (props) => (
  <DioramaCard src="/markets/fujairah.webp" alt="Fujairah City Diorama Illustration" {...props} />
);

/** 8. KALBA */
export const KalbaScene: FC<SceneProps> = (props) => (
  <DioramaCard src="/markets/kalba.webp" alt="Kalba City Diorama Illustration" {...props} />
);

export const SCENE_MAP: Record<string, FC<SceneProps>> = {
  sharjah: SharjahScene,
  ajman: AjmanScene,
  "ras-al-khaimah": RakScene,
  masafi: MasafiScene,
  dibba: DibbaScene,
  khorfakkan: KhorfakkanScene,
  fujairah: FujairahScene,
  kalba: KalbaScene,
};
