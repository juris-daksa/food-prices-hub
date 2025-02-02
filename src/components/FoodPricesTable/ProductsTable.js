import React from 'react';

const ProductsTable = ({ getTableProps, getTableBodyProps, headerGroups, prepareRow, page }) => {
  return (
    <table className="table table-hover" {...getTableProps()}>
      <thead className="thead-dark">
        {headerGroups.map(headerGroup => {
          const { key, ...restHeaderGroupProps } = headerGroup.getHeaderGroupProps();
          return (
            <tr key={key} {...restHeaderGroupProps}>
              {headerGroup.headers.map(column => {
                const { key, ...restColumnProps } = column.getHeaderProps(column.getSortByToggleProps());
                return (
                  <th key={key} {...restColumnProps} className={`col-${column.width}`}>
                    {column.render('Header')}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? <i className="bi bi-arrow-down px-2"></i>
                          : <i className="bi bi-arrow-up px-2"></i>
                        : ''}
                    </span>
                  </th>
                );
              })}
            </tr>
          );
        })}
      </thead>
      <tbody className="table-group-divider" {...getTableBodyProps()}>
        {page.map(row => {
          prepareRow(row);
          const { key, ...restRowProps } = row.getRowProps();
          return (
            <tr key={key} {...restRowProps}>
              {row.cells.map(cell => {
                const { key, ...restCellProps } = cell.getCellProps();
                return (
                  <td key={key} {...restCellProps} className={`col-${cell.column.width}`}>
                    {cell.render('Cell')}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default ProductsTable;
