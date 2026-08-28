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
        />
      </div>
    </div>
  );
};

/** 1. ABU DHABI */
export const AbuDhabiScene: FC<SceneProps> = (props) => (
  <DioramaCard src="/markets/emirates/abu_dhabi.webp" alt="Abu Dhabi City Diorama Illustration" {...props} />
);

/** 2. DUBAI */
export const DubaiScene: FC<SceneProps> = (props) => (
  <DioramaCard src="/markets/emirates/dubai.webp" alt="Dubai City Diorama Illustration" {...props} />
);

/** 3. SHARJAH */
export const SharjahScene: FC<SceneProps> = (props) => (
  <DioramaCard src="/markets/emirates/sharjah.webp" alt="Sharjah City Diorama Illustration" {...props} />
);

/** 4. AJMAN */
export const AjmanScene: FC<SceneProps> = (props) => (
  <DioramaCard src="/markets/emirates/ajman.webp" alt="Ajman City Diorama Illustration" {...props} />
);

/** 5. UMM AL QUWAIN */
export const UaqScene: FC<SceneProps> = (props) => (
  <DioramaCard src="/markets/emirates/umm_al_quwain.webp" alt="Umm Al Quwain City Diorama Illustration" {...props} />
);

/** 6. RAS AL KHAIMAH */
export const RakScene: FC<SceneProps> = (props) => (
  <DioramaCard src="/markets/emirates/ras_al_khaimah.webp" alt="Ras Al Khaimah City Diorama Illustration" {...props} />
);

/** 7. FUJAIRAH */
export const FujairahScene: FC<SceneProps> = (props) => (
  <DioramaCard src="/markets/emirates/fujairah.webp" alt="Fujairah City Diorama Illustration" {...props} />
);

export const SCENE_MAP: Record<string, FC<SceneProps>> = {
  "abu-dhabi": AbuDhabiScene,
  dubai: DubaiScene,
  sharjah: SharjahScene,
  ajman: AjmanScene,
  "umm-al-quwain": UaqScene,
  "ras-al-khaimah": RakScene,
  fujairah: FujairahScene,
};
