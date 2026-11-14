export interface NoticeState {
  type: 'success' | 'danger' | 'warning' | 'info'
  text: string
}

interface Props {
  notice: NoticeState | null
  onClose: () => void
}

export const Notice = ({ notice, onClose }: Props) => {
  if (!notice) return null
  return (
    <div className={`alert alert-${notice.type} alert-dismissible py-2 mb-0`} role="alert">
      {notice.text}
      <button type="button" className="btn-close" aria-label="Cerrar" onClick={onClose} />
    </div>
  )
}
