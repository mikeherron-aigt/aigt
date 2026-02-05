'use client';

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { useRef, useState, useEffect } from "react";


interface ArtworkItem {
  src: string;
  title: string;
  artist: string;
  year: string;
  collection?: string;
}

const heroImages = [
  "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2Fffdf589de0bc4ea786d46b0d19e5477d?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2Fecd9bd97bdd94631b8bd359628504a86?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F78f0641dd09441d8940c7e4a70caaa37?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2Fd55dfac4060d4f0eb36a87b0891cb969?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F1966a05cfb05418da8649eee471aebbb?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F25168eaaf54c432d92f9ef91b0c70273?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F8ea49871f2d147b9b748f6894c7520ad?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2Fdd0cfe564a194c7fb87c735f9d338e43?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2Fc0a258d5cae343aea89a7c36e3767fe2?format=webp&width=800"
];

const artworkData: ArtworkItem[] = [
  {
    src: "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F270bfbf622d44bb58da3863d2d4a1416?format=webp&width=800",
    title: "80s Series #2",
    artist: "John Dowling Jr.",
    year: "Contemporary",
    collection: "Cosmic Dreams Collection"
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F0b223e89165544369065645eb9e01981?format=webp&width=800",
    title: "80s Series #25",
    artist: "John Dowling Jr.",
    year: "Contemporary",
    collection: "Cosmic Dreams Collection"
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F412947b95d6b487f8e94d9db43269338?format=webp&width=800",
    title: "80s Series #14",
    artist: "John Dowling Jr.",
    year: "Contemporary",
    collection: "Cosmic Dreams Collection"
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F41a3331c307447f9a770facf2b3f3f7b?format=webp&width=800",
    title: "80s Series #53",
    artist: "John Dowling Jr.",
    year: "Contemporary",
    collection: "Cosmic Dreams Collection"
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F08edb5409851472b964e3c762012ec12?format=webp&width=800",
    title: "80s Series #38",
    artist: "John Dowling Jr.",
    year: "Contemporary",
    collection: "Cosmic Dreams Collection"
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F0758ca8fed06418c994a30eac779317f?format=webp&width=800",
    title: "80s Series #68",
    artist: "John Dowling Jr.",
    year: "Contemporary",
    collection: "Cosmic Dreams Collection"
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F99ae9a973978458da61eddb794151497?format=webp&width=800",
    title: "80s Series #99",
    artist: "John Dowling Jr.",
    year: "Contemporary",
    collection: "Cosmic Dreams Collection"
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F2249d103ff824a26a277d0c413cf9c9c?format=webp&width=800",
    title: "Cosmic Dreams #001451",
    artist: "John Dowling Jr.",
    year: "Contemporary",
    collection: "Cosmic Dreams Collection"
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F5aecfbbcd4cf49d98bf9a1eb9b2b08e9?format=webp&width=800",
    title: "80s Series #8",
    artist: "John Dowling Jr.",
    year: "Contemporary",
    collection: "Cosmic Dreams Collection"
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F57017ec8c4284ef3897083c05ccb4a39?format=webp&width=800",
    title: "80s Series #32",
    artist: "John Dowling Jr.",
    year: "Contemporary",
    collection: "Cosmic Dreams Collection"
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F4b0284b925464d1d9c172bd648f259e3?format=webp&width=800",
    title: "80s Series #29",
    artist: "John Dowling Jr.",
    year: "Contemporary",
    collection: "Cosmic Dreams Collection"
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2Fe0ebfc6ee0a247898c870f509e743ab0?format=webp&width=800",
    title: "80s Series #43",
    artist: "John Dowling Jr.",
    year: "Contemporary",
    collection: "Cosmic Dreams Collection"
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2Fa85281a076fa48b4b997fac1adf8470a?format=webp&width=800",
    title: "80s Series #123",
    artist: "John Dowling Jr.",
    year: "Contemporary",
    collection: "Cosmic Dreams Collection"
  }
];

const governanceImage: ArtworkItem = {
  src: "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F409e962a5a31455bac419bcb11ccf171?format=webp&width=800",
  title: "Contemporary Governance",
  artist: "John Dowling Jr.",
  year: "Contemporary",
  collection: "Cosmic Dreams Collection"
};

const mediumsImage: ArtworkItem = {
  src: "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F3005d3c962884059afa2392e3cdd27a7?format=webp&width=800",
  title: "One Standard Across Mediums",
  artist: "John Dowling Jr.",
  year: "Contemporary",
  collection: "Cosmic Dreams Collection"
};

const artArtistsImage: ArtworkItem = {
  src: "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F191d1f3757b744a3bb4c98c59bd49eba?format=webp&width=800",
  title: "Art and Artists",
  artist: "John Dowling Jr.",
  year: "Contemporary",
  collection: "Cosmic Dreams Collection"
};

export default function Home() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [selectedImage, setSelectedImage] = useState<ArtworkItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [heroImage, setHeroImage] = useState<string>("");
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(false);
  const [isVideoHovered, setIsVideoHovered] = useState(false);

  const faqItems = [
    {
      question: "What is an art investment fund?",
      answer: "An art investment fund is a structured vehicle that acquires and holds artworks as long term assets, typically emphasizing governance, custody, and preservation rather than short term buying and selling."
    },
    {
      question: "How does institutional art investment work?",
      answer: "Institutional art investment applies governance frameworks, professional custody standards, and long horizon ownership principles to the acquisition and stewardship of fine art."
    },
    {
      question: "Who can invest in art through Art Investment Group Trust?",
      answer: "Participation is limited to qualified purchasers, institutions, family offices, and approved partners through private conversations and governed access."
    }
  ];

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    // Don't start dragging if clicking on a button
    if ((e.target as HTMLElement).closest('button')) return;
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!sliderRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !sliderRef.current) return;
    const x = e.touches[0].pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const scrollSlider = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    const scrollAmount = 350; // Amount to scroll per click
    const newScrollLeft = direction === 'left'
      ? sliderRef.current.scrollLeft - scrollAmount
      : sliderRef.current.scrollLeft + scrollAmount;

    sliderRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  const toggleSubtitles = () => {
    if (!videoRef.current) return;
    const newState = !subtitlesEnabled;
    const textTracks = videoRef.current.textTracks;

    if (textTracks && textTracks.length > 0) {
      for (let i = 0; i < textTracks.length; i++) {
        if (textTracks[i].kind === 'subtitles' || textTracks[i].kind === 'captions') {
          textTracks[i].mode = newState ? 'showing' : 'hidden';
        }
      }
    }
    setSubtitlesEnabled(newState);
  };

  const openModal = (artwork: ArtworkItem) => {
    setSelectedImage(artwork);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      return () => {
        document.removeEventListener('keydown', handleEscapeKey);
      };
    }
  }, [isModalOpen]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * heroImages.length);
    setHeroImage(heroImages[randomIndex]);
  }, []);

  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;

    const handleLoadedMetadata = () => {
      const textTracks = video.textTracks;
      if (textTracks && textTracks.length > 0) {
        for (let i = 0; i < textTracks.length; i++) {
          const track = textTracks[i];
          if (track.kind === 'subtitles' || track.kind === 'captions') {
            // Explicitly set to showing mode
            track.mode = 'showing';
            setSubtitlesEnabled(true);
          }
        }
      }
    };

    // Try to enable subtitles after a small delay to ensure tracks are loaded
    const timeoutId = setTimeout(() => {
      if (video.textTracks && video.textTracks.length > 0) {
        for (let i = 0; i < video.textTracks.length; i++) {
          if (video.textTracks[i].kind === 'subtitles' || video.textTracks[i].kind === 'captions') {
            video.textTracks[i].mode = 'showing';
          }
        }
      }
    }, 500);

    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      clearTimeout(timeoutId);
      video.removeEvent
