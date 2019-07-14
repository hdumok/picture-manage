import { Table } from 'antd';
import React, { PureComponent } from 'react';

import styles from './index.less';

class StandardTable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleTableChange = (pagination, filters, sorter) => {
    const { onChange } = this.props;
    onChange(pagination, filters, sorter);
  };

  render() {
    const {
      data: { list, pagination },
      loading,
      columns,
      rowKey,
    } = this.props;

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };

    return (
      <div className={styles.standardTable}>
        <Table
          loading={loading}
          rowKey={rowKey}
          dataSource={list}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default StandardTable;
