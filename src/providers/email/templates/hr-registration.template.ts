export const hrRegistrationTemplate = (
  userId: string,
  registerToken: string,
  origin: string,
) => {
  return `
  <div style='text-align: center; font-family: Helvetica, Arial, sans-serif'>
    <h3>Witamy w MegaK Head Hunter,</h3>
    <p>
      Zostałeś dodany do naszej aplikacji jako rekruter.<br/>
      Kliknij przycisk poniżej, aby dokończyć rejestrację.
    </p>
    <a style='background-color: #006fff; border-radius: 9999px; padding: 10px 25px; display: block; color: white; margin-bottom: 1rem; text-decoration: none; max-width: 300px; margin-inline: auto' 
       href='${origin}/register/${userId}/${registerToken}' target='_blank'>
      Dokończ rejestrację
    </a>
    <small style='margin-bottom: 1rem'>Jeżeli dostałeś maila przypadkowo zignoruj go.</small>
    <br/>
    <small>
      Jeżeli przycisk nie działa skorzystaj z linku poniżej<br/> 
      <a href=${origin}/register/${userId}/${registerToken}' target='_blank'>${origin}/register/${userId}/${registerToken}</a>
    </small>
  </div>
`;
};
