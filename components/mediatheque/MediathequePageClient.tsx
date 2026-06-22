"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera, X, ZoomIn } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import type { GalleryImage } from "@/lib/services/cms/serialize-mediatheque";

type MediathequePageClientProps = {
  photos: GalleryImage[];
};

export function MediathequePageClient({ photos }: MediathequePageClientProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  return (
    <main className="min-h-screen bg-white">
      <PageHero
        label="Galerie — INP"
        title="Médiathèque"
        subtitle="Découvrez la galerie officielle de l'Institut National de Pédologie : laboratoires, missions de terrain et événements institutionnels."
      />

      <section className="py-12 bg-gradient-to-br from-green-50 via-white to-green-100 border-b border-green-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Camera className="h-4 w-4" />
            <span>
              <span className="font-semibold text-green-800">{photos.length}</span>{" "}
              photo{photos.length > 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-semibold text-center text-green-900 mb-4">
            Galerie photographique
          </h2>
          <div className="w-20 h-1 mx-auto rounded-full bg-[var(--inp-vert)] mb-16" />

          {photos.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">
              Aucune image publiée pour le moment.
            </p>
          ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {photos.map((photo, index) => (
              <div
                key={`${photo.src}-${index}`}
                className="group relative cursor-pointer overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500"
                onClick={() => setSelectedImage(photo)}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={600}
                  height={400}
                  className="object-cover w-full h-64 group-hover:scale-110 transition-transform duration-700"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#0f3d2e]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="absolute inset-0 flex flex-col justify-end p-5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <p className="text-sm font-semibold leading-snug">{photo.caption}</p>
                </div>

                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                    <ZoomIn className="h-4 w-4 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      </section>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-6 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 text-white hover:text-gray-300 transition z-50"
            aria-label="Fermer"
          >
            <X size={32} />
          </button>

          <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <Image
              src={selectedImage.src}
              alt={selectedImage.alt}
              width={1200}
              height={800}
              className="rounded-2xl object-contain w-full h-auto shadow-2xl"
            />
            <div className="mt-4 text-center">
              <p className="text-white text-lg font-semibold">{selectedImage.caption}</p>
              <p className="text-white/60 text-sm mt-1">
                Institut National de Pédologie
              </p>
            </div>
          </div>
        </div>
      )}

      <section className="py-24 bg-gradient-to-br from-green-50 via-white to-green-100">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-semibold text-green-900 mb-4">
            Droits & Utilisation
          </h2>
          <div className="w-20 h-1 rounded-full bg-[var(--inp-vert)] mb-8" />

          <p className="text-gray-700 leading-relaxed">
            Les images publiées dans cette médiathèque sont la propriété
            exclusive de l&apos;Institut National de Pédologie. Toute reproduction,
            distribution ou utilisation commerciale nécessite une autorisation
            écrite préalable. Pour toute demande, veuillez contacter
            l&apos;administration de l&apos;INP.
          </p>
        </div>
      </section>
    </main>
  );
}
