import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useProfile } from "@/supabase/hooks/client/useProfile";
import { ProfileFullDetails } from "@/supabase/models/profile";
import { School } from "@/supabase/models/school";
import { ArrowRight } from "lucide-react";
import React, { useMemo, useState } from "react";
import { toast } from "sonner";

function AccountSchoolSelected({
  schools,
  account,
  onRefresh,
}: {
  schools: School[];
  account: ProfileFullDetails;
  onRefresh: () => void;
}) {
  const { updateProfile } = useProfile();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState("");

  const school = useMemo(() => {
    if (!!account?.schools?.length) {
      const schoolId = account.schools[0];
      return schools.find((s) => s.id === schoolId);
    } else {
      return null;
    }
  }, [account, schools]);

  const fullSelectedSchool = useMemo(() => {
    if (selectedSchool) {
      return schools.find((s) => s.id === selectedSchool);
    } else {
      return null;
    }
  }, [selectedSchool, schools]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {!!school ? (
          <Button
            variant="outline"
            size="sm"
            className="w-60 capitalize"
            onClick={() => setOpen(true)}
            // disabled
          >
            {school.name}
          </Button>
        ) : (
          <Button
            variant="destructive"
            size="sm"
            className="w-60 capitalize"
            onClick={() => setOpen(true)}
          >
            Sin colegio
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Colégios</DialogTitle>
          <DialogDescription>
            Seleccione un colegio para asignar a la cuenta
            <span className="font-black ml-2">{account.email}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-between items-center mt-4">
          <Select value={selectedSchool} onValueChange={setSelectedSchool}>
            <SelectTrigger>
              {selectedSchool
                ? fullSelectedSchool?.name
                : "Seleccionar colegio"}
            </SelectTrigger>
            <SelectContent>
              {schools.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <ArrowRight />
          <Button
            disabled={!selectedSchool || loading}
            onClick={async () => {
              setLoading(true);
              const { success } = await updateProfile({
                schools: [selectedSchool],
                id: account.id,
              });
              if (success) {
                setSelectedSchool("");
                setLoading(false);
                setOpen(false);
                onRefresh();
                toast.success("Colegio asignado correctamente");
              } else {
                setLoading(false);
                toast.error("Error al asignar el colegio. Intente nuevamente");
              }
            }}
          >
            Asignar colegio
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AccountSchoolSelected;
