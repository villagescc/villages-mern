// third party
import Draggable from 'react-draggable';
import { Paper } from '@mui/material';

// draggable
function PaperComponent(props) {
    return (
        <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
            <Paper {...props} />
        </Draggable>
    );
}

export default PaperComponent;
