import React, { useState } from "react";
import UsersSelectors from "./UsersSelectors";
import ModalWrapper from "../Common/ModalWrapper/ModalWrapper";
import PredefinedList from "../Common/FormComponents/PredefinedList/PredefinedList";
import Grid from "@mui/material/Grid";
import { AddMembersToGroupIcon, Button } from "mds";
import api from "../../../common/api";
import { ErrorResponseHandler } from "../../../common/types";

import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import {
  formFieldStyles,
  modalBasic,
  modalStyleUtils,
} from "../Common/FormComponents/common/styleLibrary";
import withStyles from "@mui/styles/withStyles";
import { encodeURLString } from "../../../common/utils";
import { setModalErrorSnackMessage } from "../../../systemSlice";
import { useAppDispatch } from "../../../store";

type UserPickerModalProps = {
  classes?: any;
  title?: string;
  preSelectedUsers?: string[];
  selectedGroup?: string;
  open: boolean;
  onClose: () => void;
  onSaveClick: () => void;
  groupStatus?: string;
};

const styles = (theme: Theme) =>
  createStyles({
    userSelector: {
      "& .MuiPaper-root": {
        padding: 0,
        marginBottom: 15,
      },
    },
    ...modalStyleUtils,
    ...formFieldStyles,
    ...modalBasic,
  });

const AddGroupMember = ({
  classes,
  title = "",
  groupStatus = "enabled",
  preSelectedUsers = [],
  selectedGroup = "",
  open,
  onClose,
}: UserPickerModalProps) => {
  const dispatch = useAppDispatch();
  const [selectedUsers, setSelectedUsers] = useState(preSelectedUsers);

  function addMembersToGroup() {
    return api
      .invoke("PUT", `/api/v1/group/${encodeURLString(selectedGroup)}`, {
        group: selectedGroup,
        members: selectedUsers,
        status: groupStatus,
      })
      .then((res) => {
        onClose();
      })
      .catch((err: ErrorResponseHandler) => {
        onClose();
        dispatch(setModalErrorSnackMessage(err));
      });
  }

  return (
    <ModalWrapper
      modalOpen={open}
      onClose={onClose}
      title={title}
      titleIcon={<AddMembersToGroupIcon />}
    >
      <Grid container>
        <Grid item xs={12}>
          <div className={classes.formFieldRow}>
            <PredefinedList label={`Selected Group`} content={selectedGroup} />
          </div>
          <div className={classes.userSelector}>
            <UsersSelectors
              selectedUsers={selectedUsers}
              setSelectedUsers={setSelectedUsers}
              editMode={!selectedGroup}
            />
          </div>
        </Grid>
      </Grid>
      <Grid item xs={12} className={classes.modalButtonBar}>
        <Button
          id={"reset-add-group-member"}
          type="button"
          variant="regular"
          onClick={() => {
            setSelectedUsers(preSelectedUsers);
          }}
          label={"Reset"}
        />

        <Button
          id={"save-add-group-member"}
          type="button"
          variant="callAction"
          onClick={() => {
            addMembersToGroup();
          }}
          label={"Save"}
        />
      </Grid>
    </ModalWrapper>
  );
};

export default withStyles(styles)(AddGroupMember);
