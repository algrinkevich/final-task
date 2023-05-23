import "./base-authentication-form.styles.scss";

const BaseAuthenticationForm = ({
  children,
  footerContent,
  title,
  styleClasses,
}: {
  children: React.ReactNode;
  footerContent: React.ReactNode;
  title: string;
  styleClasses?: string;
}) => {
  return (
    <div className={`form-container ${styleClasses || ""}`}>
      <h2 className="form-title">{title}</h2>
      {children}
      <div className="form-footer">{footerContent}</div>
    </div>
  );
};

export default BaseAuthenticationForm;
