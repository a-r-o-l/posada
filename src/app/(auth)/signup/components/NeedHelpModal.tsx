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
import { createMessage } from "@/server/messageAction";
import { Send } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

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
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("text", values.message);
    formData.append("name", user.name);
    formData.append("email", user.email);
    const res = await createMessage(formData);
    if (res.success) {
      toast.success(res.message);
      onClose();
    } else {
      toast.error(res.message);
    }
    setLoading(false);
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
