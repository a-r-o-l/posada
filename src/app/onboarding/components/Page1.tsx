import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { School } from "@/supabase/models/school";
import { CheckCircle2, Circle, School as SchoolIcon } from "lucide-react";

function Page1({
  schools,
  selectedSchool,
  setSelectedSchool,
}: {
  schools: School[];
  selectedSchool: string;
  setSelectedSchool: (schoolId: string) => void;
}) {
  return (
    <div className="py-6 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-full mb-4">
          <SchoolIcon className="w-6 h-6 text-blue-600" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Selecciona tu colegio
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {schools?.map((school) => {
          const isSelected = selectedSchool === school.id;
          if (school.id === "7112eb7c-e96a-4ef7-aaa8-5f1e92843595") {
            return null;
          }
          return (
            <button
              key={school.id}
              onClick={() => {
                if (!school) return;
                if (isSelected) {
                  setSelectedSchool("");
                } else {
                  setSelectedSchool(school.id);
                }
              }}
              className={`group relative w-full flex flex-col items-center text-left p-5 rounded-xl transition-all duration-200 cursor-pointer ${
                isSelected
                  ? "bg-blue-50 ring-2 ring-blue-500 ring-offset-2"
                  : "bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300"
              }`}
            >
              {/* Icono de selección */}
              <div className="absolute top-3 right-3">
                {isSelected ? (
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-300 group-hover:text-gray-400" />
                )}
              </div>

              {/* Logo */}
              <div className="mb-3">
                <Avatar className="w-24 h-24 sm:w-28 sm:h-28">
                  <AvatarImage
                    src={school.image_url || "/placeholderimg.jpg"}
                    alt={school.name}
                    className="object-contain p-2"
                  />
                  <AvatarFallback className="bg-gray-100 text-gray-500 text-lg font-semibold">
                    {school.name?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Nombre */}
              <div className="w-full text-center">
                <h3
                  className="font-medium text-gray-900 text-sm sm:text-base leading-tight break-words"
                  title={school.name}
                >
                  {school.name}
                </h3>
              </div>

              {/* Badge de selección */}
              {isSelected && (
                <div className="mt-3 text-xs font-medium text-blue-600">
                  Seleccionado
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Mensaje de ayuda si no hay colegios */}
      {schools?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No hay colegios disponibles</p>
        </div>
      )}
    </div>
  );
}

export default Page1;
