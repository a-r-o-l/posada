import LoadingButton from "@/components/LoadingButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IAccount } from "@/models/Account";
import { Send } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { handleSendEmailFromUser } from "@/server/emailsAction";

const initialValues = {
  title: "",
  message: "",
};

function NeedHelpModal({
  open,
  onClose,
  user,
}: {
  open: boolean;
  onClose: () => void;
  user: IAccount;
}) {
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("username", user.name);
      formData.append("senderEmail", user.email);
      formData.append("title", values.title);
      formData.append("content", values.message);
      const res = await handleSendEmailFromUser(formData);
      if (res.success) {
        setLoading(false);
        setValues(initialValues);
        toast.success("Mensaje enviado correctamente");
        onClose();
      } else {
        setLoading(false);
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Error al enviar el mensaje");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Necesitas ayuda?</DialogTitle>
          <DialogDescription>
            Dejanos un mensaje y te responderemos lo antes posible a tu correo.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label>Asunto</Label>
            <Input
              type="text"
              className="input"
              value={values.title}
              onChange={({ target }) =>
                setValues({ ...values, title: target.value })
              }
            />
          </div>
          <div>
            <Label>Mensaje</Label>
            <Textarea
              rows={5}
              value={values.message}
              onChange={({ target }) =>
                setValues({ ...values, message: target.value })
              }
            />
          </div>
          <DialogFooter>
            <LoadingButton title="Enviar" loading={loading} onClick={onSubmit}>
              <Send />
            </LoadingButton>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default NeedHelpModal;
