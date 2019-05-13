/**
 * @license
 * Copyright 2018 Streamlit Inc. All rights reserved.
 *
 * @fileoverview Component that displays a single cell in a Pandas Dataframe.
 */

import React, {PureComponent} from 'react';
import {SortDirection} from './SortDirection';

interface Props {
  /** The cell's column index in the DataFrame */
  columnIndex: number;

  /** The cell's row index in the DataFrame */
  rowIndex: number;

  /** The cell's css class name */
  className: string;

  /** Additional css styling for the cell */
  style: object;

  /**
   * The HTML contents of the cell. Added to the DOM as a child of this
   * DataFrameCel.
   */
  contents: string;

  /**
   * If true, then the table's sorting was manually set by the user, by
   * clicking on a column header. We only show the sort arrow when this is
   * true.
   */
  sortedByUser: boolean;

  /**
   * The {@link SortDirection} for this column, or undefined if the column is
   * unsorted. No sorting is done here - this property is used to determine
   * which, if any, sort icon to draw in column-header cells.
   */
  columnSortDirection?: SortDirection;

  /**
   * An optional callback that will be called when a column header is clicked.
   * (The property is ignored for non-header cells). The callback will be passed this
   * cell's columnIndex.
   *
   * {@link DataFrame} uses this to toggle column sorting.
   */
  headerClickedCallback?: (columnIndex: number) => void;
}

class DataFrameCell extends PureComponent<Props> {
  public render(): React.ReactNode {
    const {
      columnIndex, rowIndex, className, style, contents, columnSortDirection,
      headerClickedCallback, sortedByUser,
    } = this.props;

    let onClick;
    let role;
    let tabIndex;
    let title = contents;

    const isDescending = columnSortDirection === SortDirection.DESCENDING;

    if (headerClickedCallback != null && rowIndex === 0) {
      onClick = () => headerClickedCallback(columnIndex);
      role = 'button';
      tabIndex = 0;
      title = columnSortDirection == null ?
        `Sort by column "${contents}"` :
        `Sorted by column "${contents}" (${isDescending ? 'descending' : 'ascending'})`;
    }

    // The sort icon is only drawn in the top row
    const sortIcon = rowIndex === 0 ?
      drawSortIcon(columnSortDirection) :
      undefined;

    return (
      // (eslint erroneously believes we're not assigning a role to our clickable div)
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <div
        className={className}
        style={style}
        onClick={onClick}
        role={role}
        tabIndex={tabIndex}
        title={title}
      >
        {sortedByUser ? sortIcon : ''}
        {contents}
      </div>
    );
  }
}


function drawSortIcon(sortDirection?: SortDirection): React.ReactNode {
  // If these icons are changed, you may also need to update DataFrame.SORT_ICON_WIDTH
  // to ensure proper column width padding
  switch (sortDirection) {
    case SortDirection.ASCENDING:
      return (
        <svg className="sort-arrow-icon" viewBox="0 -1 10 10">
          <use xlinkHref="./open-iconic.min.svg#chevron-top" />
        </svg>
      );

    case SortDirection.DESCENDING:
      return (
        <svg className="sort-arrow-icon" viewBox="0 -1 10 10">
          <use xlinkHref="./open-iconic.min.svg#chevron-bottom" />
        </svg>
      );

    case undefined:
    default:
      return null;
  }
}

export default DataFrameCell;