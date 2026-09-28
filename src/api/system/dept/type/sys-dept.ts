/**
 * 部门（后端 CurrentDept 下发字段的镜像：id/parentId/name/code/sort/manager/phoneNumber/email/fax/defaultDept/children）
 */
export interface SysDept {
  /**
   * 主键id
   */
  id?: string;
  /**
   * 父级id
   */
  parentId?: string;
  /**
   * 部门/岗位名称
   */
  name?: string;
  /**
   * 部门/岗位编码
   */
  code?: string;
  /**
   * 数据排序
   */
  sort?: number;
  /**
   * 负责人
   */
  manager?: string;
  /**
   * 联系电话
   */
  phoneNumber?: string;
  /**
   * 邮箱
   */
  email?: string;
  /**
   * 传真
   */
  fax?: string;
  /**
   * 默认部门标记（"0" 表示默认部门）
   */
  defaultDept?: string;
  /**
   * 子节点
   */
  children?: SysDept[];
}