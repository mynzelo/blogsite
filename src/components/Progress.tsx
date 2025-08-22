export default function Progress({
  title,
  description,
  percent,
  status,
  tags,
  startDate,
  endDate,
  links
}: {
  title: string;
  description: string;
  percent: number;
  status: 'in-progress' | 'done' | 'pending';
  tags: string[];
  startDate?: string;
  endDate?: string;
  links?: { name: string; url: string }[];
}) {
  const getStatusIcon = () => {
    switch (status) {
      case 'done':
        return '✅';
      case 'in-progress':
        return (
          <span className="pulse-ring">
            <span className="pulse-core" />
          </span>
        );
      case 'pending':
        return '⏺';
      default:
        return '';
    }
  };

  // 计算耗时天数
  const calcDays = (from: string, to?: string) => {
    const start = new Date(from);
    const end = to ? new Date(to) : new Date();
    const diffTime = end.getTime() - start.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div
      style={{
        border: '1px solid #eaeaea',
        padding: '12px',
        borderRadius: '6px',
        marginBottom: '1rem'
      }}
    >
      {/* 标题 */}
      <h3
        style={{
          margin: '0 0 4px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}
      >
        {getStatusIcon()} {title}
      </h3>

      {/* 标签区域 */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '4px', flexWrap: 'wrap' }}>
        {tags.map(tag => (
          <span
            key={tag}
            style={{
              fontSize: '0.7rem',
              padding: '2px 6px',
              borderRadius: '4px',
              background: '#f3f4f6',
              color: '#374151',
              whiteSpace: 'nowrap'
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* 描述 */}
      <small style={{ color: '#666', display: 'block', marginBottom: '4px' }}>
        {description}
      </small>

      {/* 链接列表 */}
      {links && links.length > 0 && (
        <div style={{ fontSize: '0.75rem', marginBottom: '6px' }}>
          🔗 相关链接：
          <ul style={{ margin: '4px 0 0 20px', padding: 0 }}>
            {links.map((l, i) => (
              <li key={i} style={{ marginBottom: '3px', listStyle: 'none' }}>
                <a
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-item"
                >
                  {l.name}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    style={{ width: '14px', height: '14px', marginLeft: '4px' }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 10.5L21 3m0 0v6m0-6h-6M9 15l-6 6m0 0h6m-6 0v-6"
                    />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 时间信息 */}
      {status !== 'pending' && (
        <div style={{ fontSize: '0.75rem', color: '#555', marginBottom: '6px' }}>
          {startDate && <span>📅 开始：{startDate}</span>}
          {status === 'done' && endDate && (
            <span style={{ marginLeft: '1rem' }}>✅ 结束：{endDate}</span>
          )}
          {status === 'in-progress' && startDate && (
            <span style={{ marginLeft: '1rem' }}>⏳ 已用时：{calcDays(startDate)} 天</span>
          )}
          {status === 'done' && startDate && endDate && (
            <span style={{ marginLeft: '1rem' }}>
              ⏳ 用时：{calcDays(startDate, endDate)} 天
            </span>
          )}
        </div>
      )}

      {/* 进度条 */}
      <div
        style={{
          background: '#f0f0f0',
          borderRadius: '4px',
          height: '10px',
          marginTop: '4px',
          overflow: 'hidden'
        }}
      >
        <div
          className={status === 'in-progress' ? 'progress-animated' : ''}
          style={{
            background:
              status === 'done'
                ? '#22c55e'
                : status === 'in-progress'
                ? 'linear-gradient(90deg, #0070f3, #00c6ff, #0070f3)'
                : '#999',
            width: `${percent}%`,
            height: '100%',
            borderRadius: '4px',
            transition: 'width 0.5s ease'
          }}
        />
      </div>

      <p style={{ fontSize: '0.875rem', marginTop: '4px' }}>{percent}%</p>

      {/* 样式 */}
      <style jsx>{`
        .pulse-ring {
          display: inline-block;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: rgba(0, 112, 243, 0.3);
          position: relative;
          animation: pulse 1.5s infinite;
        }
        .pulse-core {
          width: 6px;
          height: 6px;
          background: #0070f3;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(3);
            opacity: 0;
          }
        }

        .progress-animated {
          background-size: 200% 100%;
          animation: gradientMove 2s linear infinite;
        }
        @keyframes gradientMove {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 200% 50%;
          }
        }

        /* 链接 hover 动效 */
        .link-item {
          display: inline-flex;
          align-items: center;
          color: #0070f3;
          text-decoration: none;
          transition: color 0.3s, transform 0.2s;
        }
        .link-item:hover {
          color: #00c6ff;
          transform: scale(1.05);
        }
        .link-item svg {
          transition: stroke 0.3s;
        }
        .link-item:hover svg {
          stroke: #00c6ff;
        }
      `}</style>
    </div>
  );
}