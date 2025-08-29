import { Modal, Box, Typography, Button } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

interface SupplierConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}

export const SupplierConfirmationModal = ({
  open,
  onClose,
  onConfirm,
  itemName,
}: SupplierConfirmationModalProps) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">
          Confirmar Eliminación
        </Typography>
        <Typography sx={{ mt: 2 }}>
          ¿Estás seguro de que deseas eliminar a{" "}
          <Box component="span" sx={{ fontWeight: "bold" }}>
            {itemName}
          </Box>
          ? Esta acción no se puede deshacer.
        </Typography>
        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={onClose} sx={{ mr: 1 }}>
            Cancelar
          </Button>
          <Button onClick={onConfirm} variant="contained" color="error">
            Eliminar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
