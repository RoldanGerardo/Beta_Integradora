export type RolUsuario = "usuario" | "admin";

export default class Usuario {
  private id: number;
  private nombre: string;
  private username: string;
  private email: string;
  private passwordHash: string;
  private rol: RolUsuario;
  private activo: boolean;
  private fechaRegistro: string;

  constructor(id: number,nombre: string,username: string, email: string,passwordHash: string,rol: RolUsuario = "usuario", activo: boolean = true,fechaRegistro: string = new Date().toISOString().split("T")[0] ) 
  {
    this.id = id;
    this.nombre = nombre;
    this.username = username;
    this.email = email;
    this.passwordHash = passwordHash;
    this.rol = rol;
    this.activo = activo;
    this.fechaRegistro = fechaRegistro;
  }

  public getId(): number { return this.id; }
  public getNombre(): string { return this.nombre; }
  public getUsername(): string { return this.username; }
  public getEmail(): string { return this.email; }
  public getPasswordHash(): string { return this.passwordHash; }
  public getRol(): RolUsuario { return this.rol; }
  public getActivo(): boolean { return this.activo; }
  public getFechaRegistro(): string { return this.fechaRegistro; }

  public setNombre(v: string) { this.nombre = v; }
  public setUsername(v: string) { this.username = v; }
  public setEmail(v: string) { this.email = v; }
  public setPasswordHash(v: string) { this.passwordHash = v; }
  public setRol(v: RolUsuario) { this.rol = v; }
  public setActivo(v: boolean) { this.activo = v; }

  public toPublico() {
    return {
      id: this.id,
      nombre: this.nombre,
      username: this.username,
      email: this.email,
      rol: this.rol,
      activo: this.activo,
      fechaRegistro: this.fechaRegistro,
    };
  }
}