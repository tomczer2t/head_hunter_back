export const studentRegistrationTemplate = (
  userId: string,
  registerToken: string,
  origin: string,
) => {
  return `
  <div style='text-align: center'>
    <h3>Cześć,</h3>
    <p>
      Zostałeś dodany do listy kursantów MegaK.<br/>
      Kliknij przycisk poniżej, aby dokończyć rejestrację.
    </p>
    <a style='background-color: #006fff; border-radius: 9999px; padding: 10px 25px' 
       href='${origin}/register${userId}/${registerToken}'>
      Dokończ rejestrację
    </a>
    <small>Jeżeli nie jesteś kursantem MegaK zignoruj tego maila.</small>
    <small>
      Jeżeli przycisk nie działa skorzystaj z linku poniżej<br/> 
      <a href=${origin}/register${userId}/${registerToken}'>${origin}/register${userId}/${registerToken}</a>
    </small>
  </div>
`;
};
