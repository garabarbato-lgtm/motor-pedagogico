import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { 
  Calculator, 
  BookOpen, 
  Microscope, 
  Globe, 
  CheckCircle2, 
  ArrowRight,
  Sparkles
} from "lucide-react";

const C = {
  acento: "#00c48c",
  texto: "#2B2B2B",
  muted: "#4a6b60",
  btn: "#004733",
  white: "#ffffff",
  border: "#D9D9D9",
  bgFaint: "#f0fdf9"
};

const SLIDES = [
  {
    id: "mat",
    icon: <Calculator className="w-6 h-6" />,
    materia: "Matemática",
    slogan: "De la numeración a la geometría, todo el bloque de 1° a 6°.",
    dato: "435 indicadores de avance mapeados según el DC 2018.",
    tags: ["Números Naturales", "Operaciones", "Geometría", "Medida"],
    color: "#00c48c",
    status: "100% Disponible"
  },
  {
    id: "pdl",
    icon: <BookOpen className="w-6 h-6" />,
    materia: "Prácticas del Lenguaje",
    slogan: "Lectura, escritura y oralidad con enfoque comunicativo.",
    dato: "435 situaciones de enseñanza y ámbitos del estudiante.",
    tags: ["Literatura", "Formación del Estudiante", "Ciudadanía"],
    color: "#0284c7",
    status: "100% Disponible"
  },
  {
    id: "cs",
    icon: <Globe className="w-6 h-6" />,
    materia: "Ciencias Sociales",
    slogan: "Pasado y presente, sociedades y espacios geográficos.",
    dato: "Bloques completos de sociedades, culturas y territorios.",
    tags: ["Sociedades y Culturas", "Territorios", "Pasado y Presente"],
    color: "#f59e0b",
    status: "100% Disponible"
  },
  {
    id: "cn",
    icon: <Microscope className="w-6 h-6" />,
    materia: "Ciencias Naturales",
    slogan: "De los seres vivos a la Tierra, ciencia en el aula.",
    dato: "Mapeo de mundo físico, materiales y biodiversidad.",
    tags: ["Seres Vivos", "Materiales", "Mundo Físico", "La Tierra"],
    color: "#8b5cf6",
    status: "100% Disponible"
  }
];

export default function SloganSlider() {
  const [active, setActive] = useState(0);
  const containerRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrada con blur y scale sutil siguiendo emil-design-eng
      gsap.fromTo(contentRef.current, 
        { opacity: 0, scale: 0.98, filter: "blur(4px)" },
        { 
          opacity: 1, 
          scale: 1, 
          filter: "blur(0px)",
          duration: 0.4, 
          ease: "power2.out" 
        }
      );
    }, contentRef);
    return () => ctx.revert();
  }, [active]);

  const nextSlide = () => setActive((prev) => (prev + 1) % SLIDES.length);

  return (
    <div ref={containerRef} className="w-full max-w-4xl mx-auto px-4 py-12">
      {/* Título de la sección */}
      <div className="flex items-center gap-2 mb-8 justify-center md:justify-start">
        <Sparkles className="text-[#00c48c] w-5 h-5" />
        <h3 className="text-sm font-semibold uppercase tracking-widest text-[#4a6b60]">
          Cobertura Curricular PBA
        </h3>
      </div>

      <div className="relative bg-white rounded-3xl border border-[#D9D9D9] shadow-xl overflow-hidden min-h-[400px] flex flex-col md:flex-row">
        
        {/* Lado Izquierdo: Selectores */}
        <div className="w-full md:w-72 bg-[#f8faf9] border-r border-[#D9D9D9] p-6 flex flex-col gap-3">
          {SLIDES.map((slide, i) => (
            <button
              key={slide.id}
              onClick={() => setActive(i)}
              className={`
                group flex items-center gap-3 p-4 rounded-xl text-left transition-all duration-200
                ${active === i 
                  ? "bg-white shadow-md border border-[#D4E6DE] scale-[1.02]" 
                  : "hover:bg-[#f0f4f2] text-[#6B8C7D]"}
              `}
              style={{
                // Feedback activo emil-style
                transform: active === i ? "scale(1.02)" : "scale(1)"
              }}
              onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.97)"}
              onMouseUp={(e) => e.currentTarget.style.transform = active === i ? "scale(1.02)" : "scale(1)"}
            >
              <div 
                className="p-2 rounded-lg transition-colors"
                style={{ 
                  backgroundColor: active === i ? `${slide.color}20` : "transparent",
                  color: active === i ? slide.color : "inherit"
                }}
              >
                {slide.icon}
              </div>
              <div>
                <div className={`text-sm font-bold ${active === i ? "text-[#004733]" : "text-[#6B8C7D]"}`}>
                  {slide.materia}
                </div>
                {active === i && (
                  <div className="text-[10px] font-medium text-[#00c48c] flex items-center gap-1 mt-0.5">
                    <CheckCircle2 size={10} /> {slide.status}
                  </div>
                )}
              </div>
            </button>
          ))}

          <div className="mt-auto p-4 bg-[#E6FAF3] rounded-2xl border border-[#b0e8d4]">
            <p className="text-[11px] leading-relaxed text-[#004733] font-medium">
              Todo el contenido está verificado contra la Resolución N° 1482/17 de la DGCyE.
            </p>
          </div>
        </div>

        {/* Lado Derecho: Contenido */}
        <div ref={contentRef} className="flex-1 p-8 md:p-12 flex flex-col justify-center bg-white relative">
          <div 
            className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none"
            style={{ color: SLIDES[active].color }}
          >
            {SLIDES[active].icon}
          </div>

          <div className="mb-6">
            <span 
              className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
              style={{ 
                backgroundColor: `${SLIDES[active].color}15`, 
                color: SLIDES[active].color 
              }}
            >
              {SLIDES[active].materia}
            </span>
          </div>

          <h4 className="text-2xl md:text-3xl font-light text-[#2B2B2B] leading-tight mb-6">
            {SLIDES[active].slogan.split(',').map((part, idx) => (
              <span key={idx}>
                {idx === 0 ? part : <>, <span className="text-[#00c48c] italic font-normal">{part}</span></>}
              </span>
            ))}
          </h4>

          <div className="flex flex-wrap gap-2 mb-8">
            {SLIDES[active].tags.map(tag => (
              <span key={tag} className="px-3 py-1.5 bg-[#f0f4f2] text-[#4a6b60] text-xs rounded-lg border border-[#D4E6DE]">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4 pt-6 border-t border-[#f0f4f2]">
            <div className="flex -space-x-2">
               {[1,2,3,4,5,6].map(g => (
                 <div key={g} className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold ${g <= 6 ? 'bg-[#004733] text-white' : 'bg-[#D4E6DE] text-[#6B8C7D]'}`}>
                   {g}°
                 </div>
               ))}
            </div>
            <div className="text-xs text-[#6B8C7D]">
              <span className="font-bold text-[#2B2B2B]">{SLIDES[active].dato}</span>
            </div>
          </div>
          
          <button 
            onClick={nextSlide}
            className="absolute bottom-8 right-8 p-3 rounded-full hover:bg-[#f0f4f2] transition-colors group"
          >
            <ArrowRight className="text-[#6B8C7D] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
