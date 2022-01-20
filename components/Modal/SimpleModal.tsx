import type {NextPage} from 'next'
import {observer} from "mobx-react";
import Modal from '@material-ui/core/Modal';
import {makeStyles} from "@material-ui/core";
import {useState} from "react";

function getModalStyle() {
	const top = 50;
	const left = 50;

	return {
		top: `${top}%`,
		left: `${left}%`,
		transform: `translate(-${top}%, -${left}%)`,
	};
}

const useStyles = makeStyles((theme) => ({
	paper: {
		position: 'absolute',
		width: 400,
		backgroundColor: theme.palette.background.paper,
		border: '2px solid #000',
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
	},
	modal: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center"
	}
}));

type Props = {
	body: JSX.Element,
	open: boolean,
	closable: boolean,
	onClose?: (...args: any) => any
};
export const SimpleModal: (props: Props) => JSX.Element = observer((props: Props) => {
	const classes = useStyles();
	const [modalStyle] = useState(getModalStyle);
	const [open, setOpen] = useState(props.open);

	const handleClose = () => {
		setOpen(!props.closable || false);
		props.onClose && props.onClose();
	};

	return (
		<>
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="simple-modal-title"
				aria-describedby="simple-modal-description"
				className={classes.modal}
			>
				<div className={classes.paper}>
					{props.body}
				</div>
			</Modal>
		</>
	);
});

export default SimpleModal;