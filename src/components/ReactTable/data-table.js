import React, { useEffect } from 'react'
import { useTable, usePagination } from 'react-table'


// Let's add a fetchData method to our Table component that will be used to fetch
// new data when pagination state changes
// We can also add a loading state to let our table know it's loading new data
function Table({
    columns,
    data,
    fetchData,
    loading,
    pageCount: controlledPageCount,
    total,
    filter,
    sort
}) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
        state,
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0 }, // Pass our hoisted table state
            manualPagination: true, // Tell the usePagination
            // hook that we'll handle our own data fetching
            // This means we'll also have to provide our own
            // pageCount.
            pageCount: controlledPageCount,
        },
        usePagination
    )

    
    // Listen for changes in pagination and use the state to fetch our new data
    useEffect(() => {
        fetchData({ pageIndex, pageSize, filter, sort })
    }, [fetchData, pageIndex, pageSize, filter, sort])

    // Render the UI for your table
    return (
        <>
            <div className='card-body'>
                <table
                    className='table'
                    {...getTableProps()}
                    style={{ backgroundColor: 'white' }}
                >
                    <thead>
                        {headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => (
                                    <th
                                        scope='col'
                                        {...column.getHeaderProps()}>
                                        {column.render('Header')}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {!loading && page.map((row, i) => {
                            prepareRow(row)
                            return (
                                <tr {...row.getRowProps()}>
                                    {row.cells.map(cell => {
                                        return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                    })}
                                </tr>
                            )
                        })}
                        {loading && <tr>

                            <td colSpan="10000">Loading...</td>

                        </tr>}
                    </tbody>
                </table>

            </div>
            <div className='card-footer p-3'>
                <div className='row'>
                    <div className='col'>
                        <span>
                            Showing <strong>
                                {(pageIndex * pageSize) + 1} - {((pageIndex * pageSize) + pageSize) > total ? total : ((pageIndex * pageSize) + pageSize)} of {total}{' '}
                            </strong>
                        </span>
                        <br></br>
                        <span>
                            Page
                    <strong>
                                {pageIndex + 1} of {pageOptions.length}
                            </strong>
                        </span>
                    </div>
                    <div className='col-auto'>
                        <div className='custom-pagination'>
                            <span className='mx-2 d-inline-block'>Goto Page:</span>
                            <span>
                                <input
                                    type='number'
                                    className='page-number'
                                    defaultValue={pageIndex + 1}
                                    onChange={e => {
                                        const page = e.target.value ? Number(e.target.value) - 1 : 0
                                        gotoPage(page)
                                    }}
                                />
                            </span>
                            <select
                                value={pageSize}
                                onChange={(e) => setPageSize(Number(e.target.value))}
                            >
                                {[10, 20, 30, 40, 50].map((pageSize) => (
                                    <option key={pageSize} value={pageSize}>
                                        show {pageSize}
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={() => gotoPage(0)}
                                disabled={!canPreviousPage}
                            >
                                First
                    </button>
                            <button
                                onClick={() => previousPage()}
                                disabled={!canPreviousPage}
                            >
                                Previous
                    </button>
                            <button onClick={() => nextPage()} disabled={!canNextPage}>
                                Next
                    </button>
                            <button
                                onClick={() => gotoPage(pageCount - 1)}
                                disabled={!canNextPage}
                            >
                                Last
                    </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Table;
