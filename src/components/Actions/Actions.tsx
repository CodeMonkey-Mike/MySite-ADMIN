import { Button } from 'antd';
import { ButtonProps } from 'antd/lib/button';
import { useAuth } from 'src/hooks';
import _get from 'lodash/get';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

interface IButton extends ButtonProps {
  label?: string;
}

export const SubmitButton = ({ label, disabled, ...props }: IButton) => {
  const user = useAuth();
  const hasEditable = _get(user, 'user.role_id') === 1;
  return (
    <Button
      disabled={!hasEditable || disabled}
      {...props}
      type="primary"
      size="large"
      htmlType="submit"
    >
      {label}
    </Button>
  );
};

export const ActionsButton = ({
  onEdit,
  onRemove,
  disabled,
  ...props
}: IButton & {
  onEdit: () => void;
  onRemove: () => void;
}) => {
  const user = useAuth();
  const hasEditable = _get(user, 'user.role_id') === 1;
  return (
    <>
      <Button
        {...props}
        disabled={!hasEditable || disabled}
        onClick={onEdit}
        type="primary"
        icon={<EditOutlined />}
        style={{ marginRight: 10 }}
      />
      <Button
        {...props}
        disabled={!hasEditable}
        onClick={onRemove}
        type="primary"
        danger
        icon={<DeleteOutlined />}
        style={{ marginRight: 10 }}
      />
    </>
  );
};
