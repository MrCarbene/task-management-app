import { useMediaQuery } from 'usehooks-ts';
import Button from '../standard/Button';
import { useDispatch } from 'react-redux';
import { openModal } from '../../app/slices/modalSlice';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../../app/hooks';
import Column from './Column';
import { IColumn } from '../../@types/data';
import { setBoardStatus, setCurrentTab } from '../../app/slices/dataSlice';

type BoardProps = {
  hideSideNav: boolean;
};

const Board = ({ hideSideNav }: BoardProps) => {
  // store
  const dispatch = useDispatch();
  const boards = useAppSelector((state) => state.data.data);
  const CurrentBoardName = useAppSelector((state) => state.data.currentTab);

  // variables
  const currentBoard = boards?.find((board) => board.name === CurrentBoardName);
  const columnsCount: number = currentBoard?.columns
    ? currentBoard.columns.length
    : 0;
  const IsMobile = useMediaQuery('(max-width: 767px)');
  const onHide = hideSideNav || IsMobile ? 'Board__full' : '';

  // state
  const [data, setData] = useState(currentBoard);

  // hooks
  useEffect(() => {
    setData(currentBoard);

    if (!currentBoard && boards.length !== 0) {
      dispatch(setCurrentTab(boards[0].name));
      dispatch(setBoardStatus(boards[0].name));
    }

    if (boards.length === 0) {
      dispatch(setCurrentTab('No Board Found'));
    }
  }, [currentBoard, boards]);

  if (!currentBoard) {
    return (
      <div className={`Board ${onHide} Board__empty`}>
        <p className="Board__empty-txt">
          This board is empty. Create a new Board to get started.
        </p>
        <div
          className="Board__empty-btn"
          onClick={() => dispatch(openModal({ ModalType: 'AddBoard' }))}>
          <Button>&nbsp; + Create New Board &nbsp;</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`Board ${onHide}`}>
      {data?.columns?.map((col: IColumn, index: number) => (
        <Column key={col.id} columnData={col} ballColor={index} />
      ))}

      {columnsCount < 6 && <Column ballColor={3} columnData={undefined} />}
    </div>
  );
};
export default Board;
