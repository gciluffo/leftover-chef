import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { Text } from "@/components/ui/text";
import { Icon, TrashIcon, AlertCircleIcon } from "@/components/ui/icon";
import React from "react";

interface Props {
  showModal: boolean;
  onMergeSelected: () => void;
  onReplaceSelected: () => void;
}

export default function MergeIngredientsModal(props: Props) {
  const { showModal, onMergeSelected, onReplaceSelected } = props;

  return (
    <>
      <Modal isOpen={showModal}>
        <ModalBackdrop />
        <ModalContent className="max-w-[305px] items-center">
          <ModalHeader>
            <Box className="w-[56px] h-[56px] rounded-full bg-background-error items-center justify-center">
              <Icon
                as={AlertCircleIcon}
                className="stroke-warning-600"
                size="xl"
              />
            </Box>
          </ModalHeader>
          <ModalBody className="mt-0 mb-4">
            <Heading size="md" className="text-typography-950 mb-2 text-center">
              Pantry
            </Heading>
            <Text size="sm" className="text-typography-500 text-center">
              Do you want to merge the ingredients from the scanned image with
              your current pantry?
            </Text>
          </ModalBody>
          <ModalFooter className="w-full">
            <Button
              variant="outline"
              action="secondary"
              size="sm"
              onPress={() => {
                onReplaceSelected();
              }}
              className="flex-grow"
            >
              <ButtonText>Replace</ButtonText>
            </Button>
            <Button
              onPress={() => {
                onMergeSelected();
              }}
              size="sm"
              className="flex-grow"
            >
              <ButtonText>Merge</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
