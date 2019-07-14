import Exception from 'components/Exception';
import { Link } from 'dva/router';
import React from 'react';

export default () => (
  <Exception type="500" style={{ minHeight: 500, height: '80%' }} linkElement={Link} />
);
