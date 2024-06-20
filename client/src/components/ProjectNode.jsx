import React from "react";
import { Handle } from "reactflow";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";

const ProjectNode = ({ data }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <div
        onClick={onOpen}
        className="bg-[#333333] p-2 border-4 rounded-lg border-gray-800 flex justify-center items-center font-pop font-semibold cursor-pointer text-ellipsis text-center w-[10rem] h-[6rem] text-white"
      >
        {data.label}
        <Handle type="source" position="left" style={{ background: "#555" }} />
        <Handle type="target" position="right" style={{ background: "#555" }} />
      </div>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Project Information
              </ModalHeader>
              <ModalBody>
                <p className="font-bold">{data.label}</p>
                <p>{data.project}</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProjectNode;
