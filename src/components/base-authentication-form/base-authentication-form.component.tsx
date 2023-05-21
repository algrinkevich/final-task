import "./base-authentication-form.styles.scss";

const BaseAuthenticationForm = ({
  children,
  footerContent,
  title,
  styleClasses
}: {
  children: React.ReactNode;
  footerContent: React.ReactNode;
  title: string;
  styleClasses: string
}) => {
  return (
    <div className={`form-container ${styleClasses}`}>
      <h2 className="form-title">{title}</h2>
      {children}
      <span className="form-footer">{footerContent}</span>
    </div>
  );
};

export default BaseAuthenticationForm;
