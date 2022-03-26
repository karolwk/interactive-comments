const ReplayWrapper: React.FC = ({ children }) => {
  return (
    <div className="comment-wraper">
      <div className="comment-reply">
        <div className="vertical-line"></div>
      </div>
      {children}
    </div>
  );
};

export default ReplayWrapper;
