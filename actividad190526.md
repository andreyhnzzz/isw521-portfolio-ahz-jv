Fecha: 19 de mayo de 2026
Estudiante: Andrey Hernandez Salazar
Profesor: Bryan Miguel Chaves Salas
Actividad 1: Internet vs WWW
P1: ¿Es correcto lo que dijo el Rector? ¿Por qué importa la distinción del director de TI?
R: Aunque el Rector acierta en el habla cotidiana, el director de TI tiene la razón técnica. Internet funciona como la infraestructura global de transporte de datos, mientras que la WWW es una aplicación específica que opera sobre esa red. Diferenciar ambos conceptos es fundamental para diseñar políticas de ciberseguridad, gestionar permisos de acceso y cumplir con normativas de protección de información.
P2: Si usan HTTP sobre Internet solo para usuarios internos, ¿usan Internet, WWW o ambos?
R: Se emplean ambas tecnologías. La red Internet (basada en TCP/IP) se encarga de mover los paquetes de datos, y la Web (mediante HTTP y lenguajes como HTML) se ocupa de su presentación y consumo. Restringir el acceso al personal interno es simplemente un filtro administrativo que no modifica la arquitectura tecnológica subyacente.
P3: ¿Qué organismo (W3C o IETF) define los estándares más relevantes para este sistema?
R: Cada entidad regula un ámbito distinto. El IETF establece los protocolos de transporte y seguridad, como HTTP y TLS. Por su lado, el W3C se enfoca en los estándares de presentación, estructura y accesibilidad, como HTML y CSS. Según el enfoque del proyecto, se prioriza al IETF para garantizar la integridad del canal y al W3C para optimizar la experiencia de usuario.
Actividad 2: Topologías y Seguridad
P1: Para cada necesidad (A, B, C), ¿qué topología implementar y por qué?
R:
(A) Portal público: Conectado a Internet, ya que debe estar disponible para cualquier usuario. Requiere certificados HTTPS y endurecimiento del servidor.
(B) Planillas de RRHH: Red interna (Intranet). Al manejar información confidencial, debe segmentarse con VLANs y exigir autenticación estricta.
(C) Portal para constructoras: Red externa controlada (Extranet). Diseñada para socios o terceros autorizados, exige mecanismos como VPN o autenticación multifactor (MFA).
P2: ¿Cuál de los tres sistemas requiere más inversión en seguridad? ¿Por qué?
R: El sistema de Recursos Humanos (B) demanda la mayor inversión. Gestiona datos personales y económicos protegidos por legislación vigente. Una brecha de seguridad aquí generaría sanciones legales, pérdidas financieras y un grave deterioro de la imagen institucional. Además, necesita controles avanzados contra riesgos internos.
P3: ¿Podría un mismo servidor físico alojar los tres sistemas de forma segura? ¿Cómo?
R: Sí, es totalmente viable. Mediante virtualización (máquinas virtuales o contenedores) se logra una separación efectiva. Combinando un proxy inverso para dirigir el tráfico, firewalls internos y reglas de acceso independientes por entorno, se consigue un aislamiento lógico robusto. La protección depende de la configuración de red y software, no de la cantidad de hardware.
Actividad 3: URLs — Análisis y Diseño
P1 (Parte A): ¿Cuántos componentes identificás en la URL de GitHub? Nómbralos.
R: Se distinguen siete elementos estructurales:
Esquema/protocolo (https)
Subdominio (api)
Dominio principal (github.com)
Puerto (443)
Ruta de acceso (/repos/bryancs/isw521/issues)
Parámetros de consulta (?state=open&labels=semana1)
Fragmento o ancla (#comentarios)
P2 (Parte B): Diseñá Clean URLs para los recursos de la UTN.
R:
Curso ISW-521: https://utn.ac.cr/sede/san-carlos/cursos/ISW-521/2026-II
Perfil Estudiante 2022-0001: https://utn.ac.cr/estudiantes/2022-0001
Materiales Semana 3: https://utn.ac.cr/cursos/ISW-521/materiales/semana-3
Actividad 4: DNS — Árbol y Registros
P1: Para cada URL, identificá TLD, SLD y subdominio. ¿Cuáles son ccTLDs y cuáles gTLDs?
R:
campus.utn.ac.cr → Sub: campus | SLD: utn | TLD: .cr (ccTLD / geográfico)
www.netflix.com → Sub: www | SLD: netflix | TLD: .com (gTLD / genérico)
api.github.io → Sub: api | SLD: github | TLD: .io (gTLD / genérico)
app.maravilla.co.cr → Sub: app | SLD: maravilla | TLD: .cr (ccTLD / geográfico)
P2: ¿Quién administra el TLD .cr? ¿Y el .com? ¿Necesitás ICANN para registrar un subdominio?
R: La extensión .cr está gestionada por NIC Costa Rica (vinculado a la UNA), mientras que .com es operado por Verisign bajo la coordinación de ICANN. Para crear un subdominio no se requiere autorización de ICANN; basta con que el propietario del dominio actualice los registros en su propia zona DNS.
P3: Si la UTN crea egresados.utn.ac.cr, ¿necesita pagar a un registrar? ¿Por qué?
R: No implica costo adicional. Dado que la universidad ya es titular del dominio principal, habilitar un subdominio es una operación de administración interna que se resuelve añadiendo la entrada correspondiente en su servidor DNS, sin tarifas externas.
P4: ¿Qué diferencia hay entre un registro A y un registro CNAME en DNS?
R: El registro A vincula directamente un nombre de host con una dirección IPv4 específica, resolviéndose en una sola consulta. El registro CNAME actúa como un alias, redirigiendo un nombre a otro dominio completo; esto requiere una resolución en dos pasos (primero se busca el dominio destino y luego su IP asociada).