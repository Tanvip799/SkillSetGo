import React from "react";
import { Handle } from "reactflow";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";

const ModuleNode = ({ data }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <div onClick={onOpen} className="bg-[#fde047] p-2 border-4 rounded-lg border-gray-800 flex justify-center items-center font-pop text-lg font-semibold cursor-pointer text-center w-[10rem] h-[7rem]">
        <p className="text-ellipsis overflow-hidden">{data.label}</p>
        <Handle type="source" position="right" id="a" style={{ background: "#555" }} />
        <Handle type="target" position="left" id="b" style={{ background: "#555" }} />
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={true}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Module Information</ModalHeader>
              <ModalBody>
                <p className="font-bold">{data.label}</p>
                <p>{data.description}</p>
                <ul className="list-disc list-inside mt-2">
                  {data.links && data.links.map((link, index) => (
                    <li key={index}>
                      <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>Close</Button>
                <Button color="primary" onPress={onClose}>Action</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModuleNode;
